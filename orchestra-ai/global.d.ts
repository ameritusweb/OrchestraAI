declare function acquireVsCodeApi(): any;
declare var window: {
    addEventListener: (message: string, callback: (event: any) => void) => void;
    removeEventListener: (message: string, callback: (event: any) => void) => void;
};
declare var document: {
    getElementById: (id: string) => any;
};