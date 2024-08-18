import * as vscode from 'vscode';
import Observable from 'zen-observable';
import { computeDiff as computeDiffUtil, computeArrayDiff as computeArrayDiffUtil } from '../utils/observableUtils';
import { FileSystemUtils } from '../utils/FileSystemUtils';
import { StateShape, initialState } from '../constants/initialState';

type ObserverType<T> = Partial<ZenObservable.Observer<T>>;

class EnhancedSubscription<T = any> {
  private _zenObservable: Observable<T>;
  private _subscriptions: Map<ZenObservable.Subscription, ObserverType<T>>;
  private _parentObservable: EnhancedSubscription<T> | null;
  private _model: any;

  constructor(model: any, subscribe: (observer: ObserverType<T>) => ZenObservable.Subscription | void) {
    this._zenObservable = new Observable(subscribe);
    this._subscriptions = new Map();
    this._parentObservable = null;
    this._model = model;
  }

  subscribe(observerOrNext: ((value: T) => void) | ObserverType<T>, error?: (error: any) => void, complete?: () => void) {
    let observer: ObserverType<T>;

    if (typeof observerOrNext === 'function') {
      observer = {
        next: observerOrNext,
        error: error || (() => {}),
        complete: complete || (() => {}),
      };
    } else {
      observer = observerOrNext;
    }

    const subscription = this._zenObservable.subscribe(observer);
    this._subscriptions.set(subscription, observer);

    return {
      then: this,
      unsubscribe: () => {
        subscription.unsubscribe();
        this._subscriptions.delete(subscription);
      }
    };
  }

  filter(predicate: (value: T) => boolean): EnhancedSubscription<T> {
    const filtered = new EnhancedSubscription<T>(this._model, observer =>
      this._zenObservable.subscribe({
        next: value => predicate(value) && observer.next?.(value),
        error: error => observer.error?.(error),
        complete: () => observer.complete?.(),
      })
    );
    filtered._parentObservable = this;
    return filtered;
  }

  notify(value: T): void {
    this._subscriptions.forEach(observer => {
      observer.next?.(value);
    });
  }

  notifyError(error: any): void {
    this._subscriptions.forEach(observer => {
      observer.error?.(error);
    });
  }

  notifyComplete(): void {
    this._subscriptions.forEach(observer => {
      observer.complete?.();
    });
  }
}

class HistoryModel<T> {
  past: T[];
  future: T[];

  constructor() {
    this.past = [];
    this.future = [];
  }

  push(state: T): void {
    this.past.push(state);
    this.future = [];
  }

  undo(currentState: T): T | null {
    if (this.canUndo()) {
      const pastState = this.past.pop()!;
      this.future.unshift(currentState);
      return pastState;
    }
    return null;
  }

  redo(currentState: T): T | null {
    if (this.canRedo()) {
      const nextState = this.future.shift()!;
      this.past.push(currentState);
      return nextState;
    }
    return null;
  }

  canUndo(): boolean {
    return this.past.length > 0;
  }

  canRedo(): boolean {
    return this.future.length > 0;
  }

  clear(): void {
    this.past = [];
    this.future = [];
  }
}

class EnhancedZenObservable {
  private stateFileUri: vscode.Uri | null = null;
  private fileSystemUtils: FileSystemUtils;
  private state: StateShape;
  private historyModel: HistoryModel<StateShape>;
  private observables: Map<string, EnhancedSubscription<any>>;
  private diffObservables: Map<string, EnhancedSubscription<any>>;

  constructor(fileSystemUtils: FileSystemUtils) {
    this.state = initialState;
    this.fileSystemUtils = fileSystemUtils;
    this.historyModel = new HistoryModel();
    this.observables = new Map();
    this.diffObservables = new Map();
  }

  applyDiff(diff: any, currentState: any = this.state, prefix: string = ''): void {
    for (const key in diff) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (diff[key].type === 'replace') {
        currentState[key] = diff[key].value;
        this.notifyObservers(fullKey, currentState[key], diff[key]);
      } else if (diff[key].type === 'object') {
        if (typeof currentState[key] !== 'object') {
          currentState[key] = {};
        }
        this.applyDiff(diff[key].value, currentState[key], fullKey);
      } else if (diff[key].type === 'array') {
        if (!Array.isArray(currentState[key])) {
          currentState[key] = [];
        }
        this.applyArrayDiff(diff[key].value, currentState[key], fullKey);
      }
    }
  }

  applyArrayDiff(arrayDiff: any, currentArray: any[], prefix: string): void {
    arrayDiff.removed.forEach(({ index }: { index: number }) => {
      currentArray.splice(index, 1);
    });
    arrayDiff.added.forEach(({ index, value }: { index: number; value: any }) => {
      currentArray.splice(index, 0, value);
    });
    arrayDiff.changed.forEach(({ index, value }: { index: number; value: any }) => {
      this.applyDiff(value, currentArray[index], `${prefix}.${index}`);
    });
    this.notifyObservers(prefix, currentArray, arrayDiff);
  }

  notifyObservers(key: string, value: any, diff: any): void {
    // Notify exact matches
    if (this.observables.has(key)) {
      const observable = this.observables.get(key)!;
      observable.notify(value);
    }
    if (this.diffObservables.has(key)) {
      const diffObservable = this.diffObservables.get(key)!;
      diffObservable.notify(diff);
    }

    // Notify partial matches
    for (const [observerKey, observable] of this.observables.entries()) {
      if (key.startsWith(observerKey) && key !== observerKey) {
        observable.notify(this.getState(observerKey));
      }
    }
    for (const [observerKey, diffObservable] of this.diffObservables.entries()) {
      if (key.startsWith(observerKey) && key !== observerKey) {
        diffObservable.notify({
          type: 'nested',
          path: key.slice(observerKey.length + 1),
          value: diff
        });
      }
    }
  }

  computeDiff(oldObj: any, newObj: any): any {
    return computeDiffUtil(oldObj, newObj);
  }

  computeArrayDiff(oldArray: any[], newArray: any[]): any {
    return computeArrayDiffUtil(oldArray, newArray);
  }

  subscribe(key: string, callback: (value: any) => void, useDiff: boolean = false, callerLocation: string = 'Unknown'): { then: EnhancedSubscription<any>; unsubscribe: () => void; } {
    if (typeof key !== 'string') {
      console.error('Invalid key for subscribe method');
      return new EnhancedSubscription(this, () => {}).subscribe(() => {});
    }

    const observables = useDiff ? this.diffObservables : this.observables;

    // Create observables for all parts of the path
    const parts = key.split('.');
    let currentKey = '';
    for (const part of parts) {
      currentKey = currentKey ? `${currentKey}.${part}` : part;
      if (!observables.has(currentKey)) {
        observables.set(currentKey, new EnhancedSubscription(this, () => {}));
      }
    }

    const subscription = observables.get(key)!;
    return subscription.subscribe(callback);
  }

  async initializeFromFile(context: vscode.ExtensionContext): Promise<void> {
    try {
      this.stateFileUri = await this.fileSystemUtils.getOrCreateStateFile(context);
      const savedState = await this.fileSystemUtils.readStateFile(this.stateFileUri);
      this.setState(savedState);
    } catch (error) {
      console.error('Error initializing state from file:', error);
    }
  }

  private async persistState(): Promise<void> {
    if (this.stateFileUri) {
      await this.fileSystemUtils.writeStateFile(this.stateFileUri, this.state);
    }
  }

  setState(updater: ((state: StateShape) => StateShape) | StateShape, recordHistory: boolean = true): void {
    try {
      const prevState = JSON.parse(JSON.stringify(this.state));
      const newState = typeof updater === 'function' ? updater(this.state) : updater;
      const prevVersion = prevState.stateVersion;
      newState.stateVersion = this.generateNewVersion();
      const diff = this.computeDiff(this.state, newState);
      if (Object.keys(diff).length === 1) {
        newState.stateVersion = prevVersion;
        return; // no changes except for state version
      }
      this.applyDiff(diff);

      if (recordHistory) {
        this.historyModel.push(prevState);
      }

      this.persistState();

    } catch (error) {
      console.error('Error setting state:', error);
    }
  }

  undo(): void {
    const currentState = JSON.parse(JSON.stringify(this.state));
    const previousState = this.historyModel.undo(currentState);
    if (previousState) {
      this.setState(() => previousState, false);
    }
  }

  redo(): void {
    const currentState = JSON.parse(JSON.stringify(this.state));
    const nextState = this.historyModel.redo(currentState);
    if (nextState) {
      this.setState(() => nextState, false);
    }
  }

  canUndo(): boolean {
    return this.historyModel.canUndo();
  }

  canRedo(): boolean {
    return this.historyModel.canRedo();
  }

  getState(key?: string): StateShape | null {
    if (!key) return JSON.parse(JSON.stringify(this.state));
    const keys = key.split('.');
    let value: any = this.state;
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (value === undefined || value === null) {
        console.warn(`Warning: Property '${keys.slice(0, i + 1).join('.')}' is undefined in the state object. Consider adding it to the initial state.`);
        return null;
      }
      value = value[k];
    }
    if (value === undefined) {
      console.warn(`Warning: Property '${key}' is undefined in the state object. Consider adding it to the initial state.`);
    }
    return value !== undefined ? JSON.parse(JSON.stringify(value)) : undefined;
  }

  generateNewVersion(): string {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substr(2, 5);
    return `${timestamp}-${randomStr}`;
  }
}

export default EnhancedZenObservable;
