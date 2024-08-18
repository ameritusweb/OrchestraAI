import { useEffect, useState, useCallback } from 'react';
import EnhancedZenObservable from '../observables/EnhancedZenObservable'; // Adjust the import path accordingly

const vscode = acquireVsCodeApi();
const sharedObservable = new EnhancedZenObservable(); // Create a shared observable instance

export function useSharedContext(key = '', useDiff = false) {
    const [state, setState] = useState(() => sharedObservable.getState(key));

    useEffect(() => {
        const subscription = sharedObservable.subscribe(
            key,
            (newState) => {
                // Only update state if it's different
                setState(prevState => {
                    if (JSON.stringify(prevState) !== JSON.stringify(newState)) {
                        vscode.postMessage({ command: 'stateUpdate', key, data: newState });
                        return newState;
                    }
                    return prevState;
                });
            },
            useDiff
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [key, useDiff]);

    const updateState = useCallback((updater) => {
        try {
            sharedObservable.setState((currentState) => {
                const newState = typeof updater === 'function' ? updater(currentState[key]) : updater;
                if (JSON.stringify(currentState[key]) !== JSON.stringify(newState)) {
                    return {
                        ...currentState,
                        [key]: newState,
                    };
                }
                return currentState;
            });
        } catch (error) {
            console.error('Failed to update state:', error);
        }
    }, [key]);

    return [state, updateState];
}