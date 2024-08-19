import * as vscode from 'vscode';
import EnhancedZenObservable from '../observables/EnhancedZenObservable';
import { StateShape } from '../constants/initialState';

export function setupWebviewMessageHandler(
  view: vscode.WebviewView, 
  subscriptions: vscode.Disposable[], 
  sharedObservable: EnhancedZenObservable
) {
  const disposables: vscode.Disposable[] = [];

  const messageHandler = view.webview.onDidReceiveMessage(
    (message) => {
      switch (message.command) {
        case 'getState':
          sendStateUpdate(view, message.key, sharedObservable.getState(message.key));
          break;
        case 'updateState':
          updateSharedState(sharedObservable, message.key, message.data);
          break;
      }
    }
  );

  disposables.push(messageHandler);

  // Set up a subscription to the sharedObservable to send updates to the webview
  const stateSubscription = sharedObservable.subscribe('', (newState) => {
    sendStateUpdate(view, '', newState);
  });

  disposables.push({ dispose: () => stateSubscription.unsubscribe() });

  view.onDidDispose(() => {
    disposables.forEach(disposable => disposable.dispose());
  }, null, subscriptions);
}

function sendStateUpdate(view: vscode.WebviewView, key: string, data: any) {
  view.webview.postMessage({ command: 'stateUpdate', key, data });
}

function updateSharedState(sharedObservable: EnhancedZenObservable, key: string, data: any) {
  sharedObservable.setState((prevState: StateShape) => {
    const newState = { ...prevState };
    const keys = key.split('.');
    let current: any = newState;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = data;
    return newState;
  });
}