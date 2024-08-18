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
      if (message.command === 'updateState') {
        try {
          sharedObservable.setState((prevState: StateShape) => {
            const newState = { ...prevState };
            const keys = message.key.split('.');
            let current: any = newState;
            for (let i = 0; i < keys.length - 1; i++) {
              if (!current[keys[i]]) {
                current[keys[i]] = {};
              }
              current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = message.data;
            return newState;
          });
        } catch (error) {
          console.error(`Error updating state for key "${message.key}":`, error);
          vscode.window.showErrorMessage(`Failed to update state: ${(error as any).message}`);
        }
      }
    }
  );

  disposables.push(messageHandler);

  view.onDidDispose(() => {
    disposables.forEach(disposable => disposable.dispose());
  }, null, subscriptions);
}