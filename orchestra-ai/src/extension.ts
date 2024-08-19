// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import EnhancedZenObservable from './observables/EnhancedZenObservable';
import { ChatViewProvider } from './providers/ChatViewProvider';
import { ProjectViewProvider } from './providers/ProjectViewProvider';
import { SettingsViewProvider } from './providers/SettingsViewProvider';
import { FileSystemUtils } from './utils/FileSystemUtils';

const fileSystemUtils = new FileSystemUtils();
const sharedObservable = new EnhancedZenObservable(fileSystemUtils);
const activeWebviews: vscode.WebviewView[] = [];

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

    await sharedObservable.initializeFromFile(context);
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "orchestra-ai" is now active!');

	// const myTreeDataProvider = new MyTreeDataProvider();

    // const provider = new ColorsViewProvider(context.extensionUri);

    // vscode.window.registerWebviewViewProvider('orchestraActivityView', provider);

    const settingsViewProvider = new SettingsViewProvider(context.extensionUri, context.subscriptions, sharedObservable);

    vscode.window.registerWebviewViewProvider('mySettingsView', settingsViewProvider);

    const provider = new ProjectViewProvider(context.extensionUri, context.subscriptions, sharedObservable);

    vscode.window.registerWebviewViewProvider('orchestraActivityView', provider);

    const chatProvider = new ChatViewProvider(context.extensionUri, context.subscriptions, sharedObservable);

    vscode.window.registerWebviewViewProvider('orchestraChatView', chatProvider);

    // vscode.window.registerTreeDataProvider('orchestraActivityView', provider);

    // Broadcast state updates to all active webviews
    sharedObservable.subscribe('', (newState) => {
        activeWebviews.forEach(webview => {
        webview.webview.postMessage({ command: 'stateUpdate', data: newState });
        });
    });
}

class MyTreeDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
        return Promise.resolve([new vscode.TreeItem('Item 1'), new vscode.TreeItem('Item 2')]);
    }
}

// This method is called when your extension is deactivated
export function deactivate() {}