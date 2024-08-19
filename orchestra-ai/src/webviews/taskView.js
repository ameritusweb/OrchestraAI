import React from 'react';
import TaskView from '../components/TaskView';
import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(<TaskView />);

// Handle incoming messages from the extension
window.addEventListener('message', (event) => {
  const message = event.data;
  console.log('Message received in TaskView:', message);
});
