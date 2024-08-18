import { useEffect, useState } from 'react';
import EnhancedZenObservable from './EnhancedZenObservable'; // Adjust the import path accordingly

const vscode = acquireVsCodeApi();
const sharedObservable = new EnhancedZenObservable(); // Create a shared observable instance

export function useSharedContext(key = '', useDiff = false) {
  const [state, setState] = useState(() => sharedObservable.getState(key));

  useEffect(() => {
    // Subscribe to the shared observable
    const subscription = sharedObservable.subscribe(
      key,
      (newState) => setState(newState),
      useDiff
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [key, useDiff]);

  const updateState = (newState) => {
    sharedObservable.setState((currentState) => {
      const updatedState = typeof newState === 'function' ? newState(currentState) : newState;
      return {
        ...currentState,
        [key]: updatedState,
      };
    });
    vscode.postMessage({
      command: 'updateState',
      data: sharedObservable.getState(key),
    });
  };

  return [state, updateState];
}