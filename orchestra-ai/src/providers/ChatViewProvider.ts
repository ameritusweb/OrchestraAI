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

        async function handleWebviewMessage(message: any) {
            switch (message.command) {
              case 'getAvailableModels':
                const models = await vscode.lm.selectChatModels({ vendor: 'copilot' });
                webviewView.webview.postMessage({ command: 'availableModels', models });
                break;
          
              case 'sendMessage':
                if (message.useLocalApi) {
                  sendMessageToLocalApi(message.message, message.localApiEndpoint, message.context);
                } else {
                  sendMessageToVSCodeApi(message.message, message.model, message.context);
                }
                break;
          
              case 'getActiveEditorContent':
                const editor = vscode.window.activeTextEditor;
                if (editor) {
                  const content = editor.document.getText();
                  webviewView.webview.postMessage({ command: 'appendResponse', content: `Active editor content set as context: ${content.substring(0, 100)}...` });
                } else {
                  webviewView.webview.postMessage({ command: 'error', error: 'No active editor' });
                }
                break;
            }
          }
          
          async function sendMessageToVSCodeApi(message: string, modelId: string, context: string) {
            try {
              const [model] = await vscode.lm.selectChatModels({ id: modelId });
              if (!model) {
                webviewView.webview.postMessage({ command: 'error', error: 'Selected model not available' });
                return;
              }
          
              const craftedPrompt = [
                vscode.LanguageModelChatMessage.User(context),
                vscode.LanguageModelChatMessage.User(message)
              ];
          
              const response = await model.sendRequest(craftedPrompt, {}, new vscode.CancellationTokenSource().token);
          
              for await (const fragment of response.text) {
                webviewView.webview.postMessage({ command: 'appendResponse', content: fragment });
              }
            } catch (err) {
              if (err instanceof vscode.LanguageModelError) {
                webviewView.webview.postMessage({ command: 'error', error: `${err.message} (${err.code})` });
              } else {
                webviewView.webview.postMessage({ command: 'error', error: 'An unexpected error occurred' });
              }
            }
          }
          
          async function sendMessageToLocalApi(message: string, apiEndpoint: string, context: string) {
            try {
              const response = await axios.post(apiEndpoint, {
                message: message,
                context: context
              });
          
              if (response.data && response.data.response) {
                webviewView.webview.postMessage({ command: 'appendResponse', content: response.data.response });
              } else {
                throw new Error('Invalid response from local API');
              }
            } catch (error) {
              webviewView.webview.postMessage({ command: 'error', error: `Error calling local API: ${error.message}` });
            }
          }
        
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