import * as vscode from 'vscode';
import EnhancedZenObservable from '../observables/EnhancedZenObservable';

export function setupWebviewMessageHandler(view: vscode.WebviewView, subscriptions: vscode.Disposable[], sharedObservable: EnhancedZenObservable) {
    const disposables: vscode.Disposable[] = [];
  
    const messageHandler = view.webview.onDidReceiveMessage(
      (message) => {
        if (message.command === 'updateState') {
          sharedObservable.setState({ [message.key]: message.data });
        }
      }
    );
  
    disposables.push(messageHandler);
  
    view.onDidDispose(() => {
      disposables.forEach(disposable => disposable.dispose());
    }, null, subscriptions);
  }