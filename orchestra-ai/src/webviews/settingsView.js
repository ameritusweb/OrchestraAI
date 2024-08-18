import React from 'react';
import SettingsView from '../components/SettingsView';
import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(<SettingsView />);

// Handle incoming messages from the extension
window.addEventListener('message', (event) => {
  const message = event.data;
  console.log('Message received in SettingsView:', message);
});
