import * as vscode from 'vscode';
import EnhancedZenObservable from '../observables/EnhancedZenObservable';
import { setupWebviewMessageHandler } from '../utils/webviewUtils';

export class ChatViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'orchestra-ai.chatView';

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
        
        setupWebviewMessageHandler(webviewView, this._subscriptions, this._sharedObservable);
    }

    private _getHtmlForWebview(webview: vscode.Webview): string {
        // Construct the URI for the bundled projectView.js script
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'chatView.js'));
        vscode.window.showInformationMessage(scriptUri.toString());
        const bootstrapUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', "css", 'bootstrap.min.css'));
        const customStylesUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', "css", 'custom.css'));
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Orchestra AI Chat View</title>
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