# Orchestra AI Developer Guide

## Table of Contents
1. [Adding New Modules and Webviews](#adding-new-modules-and-webviews)
2. [Working with Shared State](#working-with-shared-state)
3. [EnhancedZenObservable Usage](#enhancedzobservable-usage)
4. [Webview Communication](#webview-communication)
5. [Subscribing to State Updates](#subscribing-to-state-updates)
6. [Leveraging Bootstrap in Webviews](#leveraging-bootstrap-in-webviews)

## Adding New Modules and Webviews

To add a new module with a webview:

1. Create a new provider file in `src/providers`, e.g., `NewFeatureProvider.ts`:

   ```typescript
   import * as vscode from 'vscode';
   import EnhancedZenObservable from '../observables/EnhancedZenObservable';
   import { setupWebviewMessageHandler } from '../utils/webviewUtils';

   export class NewFeatureProvider implements vscode.WebviewViewProvider {
     constructor(
       private readonly _extensionUri: vscode.Uri,
       private readonly _subscriptions: vscode.Disposable[],
       private readonly _sharedObservable: EnhancedZenObservable,
     ) {}

     public resolveWebviewView(webviewView: vscode.WebviewView, ...) {
       // Set up webview
       webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
       setupWebviewMessageHandler(webviewView, this._subscriptions, this._sharedObservable);
     }

     private _getHtmlForWebview(webview: vscode.Webview): string {
       // Return HTML for the webview
     }
   }
   ```

2. Create a new React component in `src/components`, e.g., `NewFeature.tsx`:

   ```typescript
   import React from 'react';
   import { useSharedContext } from '../hooks/useSharedContext';

   const NewFeature: React.FC = () => {
     const [state, updateState] = useSharedContext('newFeature');

     // Component logic

     return (
       // JSX
     );
   };

   export default NewFeature;
   ```

3. Update `package.json` to register the new view:

   ```json
   "contributes": {
     "views": {
       "orchestraActivity": [
         {
           "id": "newFeatureView",
           "type": "webview",
           "name": "New Feature"
         }
       ]
     }
   }
   ```

4. Update `extension.ts` to register the new provider:

   ```typescript
   const newFeatureProvider = new NewFeatureProvider(context.extensionUri, context.subscriptions, sharedObservable);
   vscode.window.registerWebviewViewProvider('newFeatureView', newFeatureProvider);
   ```

## Working with Shared State

The shared state is managed through the `EnhancedZenObservable` class. To update the state:

```typescript
sharedObservable.setState((currentState) => ({
  ...currentState,
  newFeature: {
    // New feature state
  }
}));
```

To access the state in a React component, use the `useSharedContext` hook:

```typescript
const [state, updateState] = useSharedContext('newFeature');

// Update state
updateState((prevState) => ({
  ...prevState,
  someProperty: newValue
}));
```

## EnhancedZenObservable Usage

`EnhancedZenObservable` provides methods for state management:

- `setState(updater)`: Update the state
- `getState(key?)`: Get the entire state or a specific part
- `subscribe(key, callback, useDiff)`: Subscribe to state changes
- `undo()` and `redo()`: Undo/redo state changes

Example:

```typescript
const observable = new EnhancedZenObservable(initialState);

observable.subscribe('newFeature', (newState) => {
  console.log('New feature state:', newState);
});

observable.setState((currentState) => ({
  ...currentState,
  newFeature: { value: 42 }
}));
```

## Webview Communication

The `setupWebviewMessageHandler` function sets up communication between the extension and webviews:

```typescript
setupWebviewMessageHandler(webviewView, subscriptions, sharedObservable);
```

To send a message from the webview to the extension:

```typescript
vscode.postMessage({ command: 'updateState', key: 'newFeature', data: newValue });
```

To handle messages in the extension:

```typescript
webviewView.webview.onDidReceiveMessage((message) => {
  if (message.command === 'updateState') {
    sharedObservable.setState({ [message.key]: message.data });
  }
});
```

## Subscribing to State Updates

In React components, use the `useSharedContext` hook to subscribe to state updates:

```typescript
const [state, updateState] = useSharedContext('newFeature');

React.useEffect(() => {
  console.log('New feature state changed:', state);
}, [state]);
```

In the extension, subscribe directly to the `EnhancedZenObservable`:

```typescript
sharedObservable.subscribe('newFeature', (newState) => {
  console.log('New feature state changed:', newState);
});
```

## Leveraging Bootstrap in Webviews

Bootstrap is included in the project for styling webviews. To use Bootstrap:

1. Ensure Bootstrap CSS is linked in your webview HTML:

   ```html
   <link href="${bootstrapUri}" rel="stylesheet">
   ```

2. Use Bootstrap classes in your React components:

   ```jsx
   <div className="container">
     <div className="row">
       <div className="col-md-6">
         <button className="btn btn-primary">Click me</button>
       </div>
     </div>
   </div>
   ```

3. For interactive components, you may need to initialize them. In your React component:

   ```typescript
   import { Modal } from 'bootstrap';

   React.useEffect(() => {
     const modal = new Modal(document.getElementById('exampleModal'));
     // Use modal methods as needed
   }, []);
   ```

Remember to adapt Bootstrap's JavaScript initialization for React's lifecycle and state management.