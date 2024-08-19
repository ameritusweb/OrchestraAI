import * as vscode from 'vscode';
import EnhancedZenObservable from '../observables/EnhancedZenObservable';
import { setupWebviewMessageHandler } from '../utils/webviewUtils';
import path from 'path';

export class TestViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'orchestra-ai.testView';

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
            case 'getTests':
              const tests = await loadTests();
              webviewView.webview.postMessage({ command: 'updateTests', tests });
              break;
            case 'saveTest':
              await saveTest(message.test);
              const updatedTests = await loadTests();
              webviewView.webview.postMessage({ command: 'updateTests', tests: updatedTests });
              break;
            case 'deleteTest':
              await deleteTest(message.testId);
              const remainingTests = await loadTests();
              webviewView.webview.postMessage({ command: 'updateTests', tests: remainingTests });
              break;
            case 'runTests':
              const results = await runTests(message.testIds);
              webviewView.webview.postMessage({ command: 'testRunComplete', results });
              break;
          }
        }
        
        async function loadTests(): Promise<any[]> {
          const testFolderPath = getTestFolderPath();
          const testFiles = await vscode.workspace.findFiles(new vscode.RelativePattern(testFolderPath, '*.test.js'));
          
          return Promise.all(testFiles.map(async file => {
            const content = await vscode.workspace.fs.readFile(file);
            return {
              id: path.basename(file.path),
              name: path.basename(file.path, '.test.js'),
              code: content.toString(),
              status: 'not run'
            };
          }));
        }
        
        async function saveTest(test: any) {
          const testFolderPath = getTestFolderPath();
          const testFilePath = path.join(testFolderPath, `${test.name}.test.js`);
          await vscode.workspace.fs.writeFile(vscode.Uri.file(testFilePath), Buffer.from(test.code));
        }
        
        async function deleteTest(testId: string) {
          const testFolderPath = getTestFolderPath();
          const testFilePath = path.join(testFolderPath, testId);
          await vscode.workspace.fs.delete(vscode.Uri.file(testFilePath));
        }
        
        async function runTests(testIds: string[] | 'all'): Promise<Record<string, any>> {
          const testFolderPath = getTestFolderPath();
          const testFiles = testIds === 'all' 
            ? await vscode.workspace.findFiles(new vscode.RelativePattern(testFolderPath, '*.test.js'))
            : testIds.map(id => vscode.Uri.file(path.join(testFolderPath, id)));
        
          const results: Record<string, any> = {};
        
          for (const file of testFiles) {
            try {
              // In a real scenario, you would use a proper test runner here
              // This is a simplified simulation
              const content = await vscode.workspace.fs.readFile(file);
              const testFunction = new Function('assert', content.toString());
              testFunction(require('assert'));
              results[path.basename(file.path)] = { status: 'passed' };
            } catch (error) {
              results[path.basename(file.path)] = { 
                status: 'failed',
                error: error.message,
                stackTrace: error.stack
              };
            }
          }
        
          return results;
        }
        
        function getTestFolderPath(): string {
          const workspaceFolders = vscode.workspace.workspaceFolders;
          if (!workspaceFolders) {
            throw new Error('No workspace folder found');
          }
          return path.join(workspaceFolders[0].uri.fsPath, 'tests');
        }
        
        setupWebviewMessageHandler(webviewView, this._subscriptions, this._sharedObservable, handleWebviewMessage);
    }

    private _getHtmlForWebview(webview: vscode.Webview): string {
        // Construct the URI for the bundled testView.js script
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'testView.js'));
        vscode.window.showInformationMessage(scriptUri.toString());
        const bootstrapUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', "css", 'bootstrap.min.css'));
        const customStylesUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', "css", 'custom.css'));
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Orchestra AI Test View</title>
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