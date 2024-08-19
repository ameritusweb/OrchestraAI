import { useState, useEffect, useCallback } from 'react';

const vscode = acquireVsCodeApi();

export function useSharedContext(key = '') {
  const [state, setState] = useState(null);

  useEffect(() => {
    const messageHandler = (event) => {
      const message = event.data;
      if (message.command === 'stateUpdate' && message.key === key) {
        setState(message.data);
      }
    };

    window.addEventListener('message', messageHandler);

    // Request initial state
    vscode.postMessage({ command: 'getState', key });

    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, [key]);

  const updateState = useCallback((updater) => {
    const newState = typeof updater === 'function' ? updater(state) : updater;
    vscode.postMessage({
      command: 'updateState',
      key,
      data: newState
    });
  }, [key, state]);

  return [state, updateState, vscode];
}