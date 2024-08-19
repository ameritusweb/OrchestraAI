import React from 'react';
import VersionControlView from '../components/VersionControlView';
import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(<VersionControlView />);

// Handle incoming messages from the extension
window.addEventListener('message', (event) => {
  const message = event.data;
  console.log('Message received in VersionControlView:', message);
});
