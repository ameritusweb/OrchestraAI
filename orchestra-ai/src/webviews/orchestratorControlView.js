import React from 'react';
import OrchestratorControlView from '../components/OrchestratorControlView';
import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(<OrchestratorControlView />);

// Handle incoming messages from the extension
window.addEventListener('message', (event) => {
  const message = event.data;
  console.log('Message received in OrchestratorControlView:', message);
});
