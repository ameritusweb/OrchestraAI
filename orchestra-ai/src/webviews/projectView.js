import React from 'react';
import ProjectView from '../components/ProjectView';
import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(<ProjectView />);

// Handle incoming messages from the extension
window.addEventListener('message', (event) => {
  const message = event.data;
  console.log('Message received in ProjectView:', message);
});
