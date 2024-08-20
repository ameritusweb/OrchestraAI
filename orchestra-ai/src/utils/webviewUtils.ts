import * as vscode from 'vscode';
import EnhancedZenObservable from '../observables/EnhancedZenObservable';
import { StateShape } from '../constants/initialState';
import path from 'path';
import fs from 'fs';

export function setupWebviewMessageHandler(
  view: vscode.WebviewView, 
  subscriptions: vscode.Disposable[], 
  sharedObservable: EnhancedZenObservable,
  customMessageHandler: (message: any) => void = () => {}
) {
  const disposables: vscode.Disposable[] = [];

  const messageHandler = view.webview.onDidReceiveMessage(
    async (message) => {
      switch (message.command) {
        case 'getState':
          sendStateUpdate(view, message.key, sharedObservable.getState(message.key));
          return;
        case 'updateState':
          updateSharedState(sharedObservable, message.key, message.data);
          sendStateUpdate(view, message.key, sharedObservable.getState(message.key));
          return;
        case 'importFile':
          await handleImportFile(message.destinationFolder, view.webview);
          return;
        case 'viewFile':
          await handleViewFile(sharedObservable, message.filePath);
          return;
        case 'viewDiff':
          await showDiff(message.filePath, message.oldVersion, message.newVersion);
          return;
      }
      customMessageHandler(message);
      sendStateUpdate(view, message.key, sharedObservable.getState(message.key));
    }
  );

  disposables.push(messageHandler);

  // // Set up a subscription to the sharedObservable to send updates to the webview
  // const stateSubscription = sharedObservable.subscribe('', (newState) => {
  //   sendStateUpdate(view, '', newState);
  // });

  // disposables.push({ dispose: () => stateSubscription.unsubscribe() });

  view.onDidDispose(() => {
    disposables.forEach(disposable => disposable.dispose());
  }, null, subscriptions);
}

async function showDiff(filePath: string, oldVersion: any, newVersion: any) {
  const oldUri = vscode.Uri.parse(`untitled:${filePath}-${oldVersion.version}`);
  const newUri = vscode.Uri.parse(`untitled:${filePath}-${newVersion.version}`);

  const oldDoc = await vscode.workspace.openTextDocument(oldUri);
  const newDoc = await vscode.workspace.openTextDocument(newUri);

  const edit = new vscode.WorkspaceEdit();
  edit.insert(oldUri, new vscode.Position(0, 0), oldVersion.content);
  edit.insert(newUri, new vscode.Position(0, 0), newVersion.content);
  await vscode.workspace.applyEdit(edit);

  vscode.commands.executeCommand('vscode.diff', oldUri, newUri, `Diff: ${path.basename(filePath)}`);
}

async function handleViewFile(sharedObservable: EnhancedZenObservable, filePath: string) {
  try {
    // Create a URI for a new untitled file
    const newFile = vscode.Uri.parse(`untitled:${filePath}`);
    
    // Get file content from your version control state
    const fileContent = sharedObservable.getState('versionControlView')['fileSystem'][filePath].content;

    // Create a new text document
    const document = await vscode.workspace.openTextDocument(newFile);
    
    // Insert the content into the document
    const edit = new vscode.WorkspaceEdit();
    edit.insert(newFile, new vscode.Position(0, 0), fileContent);
    await vscode.workspace.applyEdit(edit);

    // Show the document in a new editor
    const editor = await vscode.window.showTextDocument(document, vscode.ViewColumn.Beside);

    // Optionally, make the document read-only
    // editor.options = { ...editor.options, readOnly: true };
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to open file: ${error}`);
  }
}

async function handleImportFile(destinationFolder: string, webview: vscode.Webview) {
  try {
    const result = await vscode.window.showOpenDialog({
      canSelectMany: false,
      openLabel: 'Import',
      filters: {
        'All Files': ['*']
      }
    });

    if (result && result.length > 0) {
      const filePath = result[0].fsPath;
      const fileName = path.basename(filePath);
      const content = fs.readFileSync(filePath, 'utf8');
      const importedFilePath = destinationFolder ? `${destinationFolder}/${fileName}` : fileName;

      webview.postMessage({
        command: 'importedFile',
        file: {
          path: importedFilePath,
          content: content
        }
      });
    }
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to import file: ${error}`);
  }
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