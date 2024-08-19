import * as vscode from 'vscode';
import EnhancedZenObservable from '../observables/EnhancedZenObservable';
import { setupWebviewMessageHandler } from '../utils/webviewUtils';

export class VersionControlViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'orchestra-ai.versionControlView';

    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri,
        private readonly _subscriptions: vscode.Disposable[],
        private readonly _sharedObservable: EnhancedZenObservable,
    ) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            // Make sure to update the local resource roots to allow access to your dist folder
            localResourceRoots: [vscode.Uri.joinPath(this._extensionUri, 'dist')]
        };

        // Set the HTML content of the webview, which includes the reference to your projectView.js script
        const html = this._getHtmlForWebview(webviewView.webview);
        vscode.window.showInformationMessage(html);
        webviewView.webview.html = html;

        async function showDiff(oldVersion: { content: string, fileName: string }, newVersion: { content: string, fileName: string }) {
          const oldUri = vscode.Uri.parse(`untitled:${oldVersion.fileName}`);
          const newUri = vscode.Uri.parse(`untitled:${newVersion.fileName}`);
        
          const oldDoc = await vscode.workspace.openTextDocument(oldUri);
          const newDoc = await vscode.workspace.openTextDocument(newUri);
        
          await vscode.workspace.applyEdit(new vscode.WorkspaceEdit());
          const edit = new vscode.WorkspaceEdit();
          edit.insert(oldUri, new vscode.Position(0, 0), oldVersion.content);
          edit.insert(newUri, new vscode.Position(0, 0), newVersion.content);
          await vscode.workspace.applyEdit(edit);
        
          const config = vscode.workspace.getConfiguration('versionControl');
          const diffViewMode = config.get<string>('diffViewMode', 'inline');
        
          vscode.commands.executeCommand('vscode.diff', oldUri, newUri, 'Version Comparison', { viewMode: diffViewMode });
        }
        
        function showNotification(type: 'info' | 'warning' | 'error', message: string) {
          switch (type) {
            case 'info':
              vscode.window.showInformationMessage(message);
              break;
            case 'warning':
              vscode.window.showWarningMessage(message);
              break;
            case 'error':
              vscode.window.showErrorMessage(message);
              break;
          }
        }

        async function handleWebviewMessage(message: any) {
            
          switch (message.command) {
            case 'viewDiff':
              await showDiff(message.oldVersion, message.newVersion);
              return;
            case 'showNotification':
              showNotification(message.type, message.message);
              return;
          }
        }
        
        setupWebviewMessageHandler(webviewView, this._subscriptions, this._sharedObservable, handleWebviewMessage);
    }

    private _getHtmlForWebview(webview: vscode.Webview): string {
        // Construct the URI for the bundled versionControlView.js script
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'versionControlView.js'));
        vscode.window.showInformationMessage(scriptUri.toString());
        const bootstrapUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', "css", 'bootstrap.min.css'));
        const customStylesUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', "css", 'custom.css'));
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Orchestra AI Version Control View</title>
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src ${webview.cspSource};">
                <link href="${bootstrapUri}" rel="stylesheet">
                <link href="${customStylesUri}" rel="stylesheet">
            </head>
            <body>
                <div id="root"></div>
                <script src="${scriptUri}"></script>
            </body>
            </html>
        `;
    }
}