// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "orchestra-ai" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('orchestra-ai.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from OrchestraAI!');
	});

	context.subscriptions.push(disposable);

    context.subscriptions.push(
        vscode.commands.registerCommand('orchestra-ai.showCustomTab', () => {

            // Set the HTML content for the webview
            // panel.webview.html = getWebviewContent();
        })
    );

	// const myTreeDataProvider = new MyTreeDataProvider();

    const bottomProvider = new CustomViewBottomProvider(context.extensionUri);

    vscode.window.registerWebviewViewProvider('myCustomView', bottomProvider);

    // const provider = new ColorsViewProvider(context.extensionUri);

    // vscode.window.registerWebviewViewProvider('orchestraActivityView', provider);

    // const myTreeDataProvider2 = new MyTreeDataProvider();

    const provider = new ProjectViewProvider(context.extensionUri);

    vscode.window.registerWebviewViewProvider('orchestraActivityView', provider);

    const provider2 = new CustomViewProvider(context.extensionUri);

    vscode.window.registerWebviewViewProvider('orchestraActivityView2', provider2);
    // vscode.window.registerTreeDataProvider('orchestraActivityView', provider);
}

class MyTreeDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
        return Promise.resolve([new vscode.TreeItem('Item 1'), new vscode.TreeItem('Item 2')]);
    }
}

function getWebviewContent() {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>My Custom Tab</title>
        </head>
        <body>
            <h1>Hello from My Custom Tab!</h1>
            <p>This is where you can place your custom content.</p>
        </body>
        </html>
    `;
}

// This method is called when your extension is deactivated
export function deactivate() {}

class ProjectViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'orchestra-ai.projectView';

    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri,
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
    }

    private _getHtmlForWebview(webview: vscode.Webview): string {
        // Construct the URI for the bundled projectView.js script
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'projectView.js'));
        vscode.window.showInformationMessage(scriptUri.toString());
        const bootstrapUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', "css", 'bootstrap.min.css'));
        const customStylesUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', "css", 'custom.css'));
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Orchestra AI Project View</title>
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

class CustomViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'orchestra-ai.customView';

    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri,
    ) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Orchestra AI Custom View</title>
            </head>
            <body>
                <h1>Orchestra AI Custom View</h1>
                <p>This is your custom view in the bottom panel.</p>
            </body>
            </html>
        `;
    }
}

class CustomViewBottomProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'orchestra-ai.customView';

    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri,
    ) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Orchestra AI Custom View</title>
            </head>
            <body>
                <h1>AI Settings</h1>
                <p>This is your custom view in the bottom panel.</p>
            </body>
            </html>
        `;
    }
}