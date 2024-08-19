import React from 'react';
import ChatView from '../components/ChatView';
import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(<ChatView />);

// Handle incoming messages from the extension
window.addEventListener('message', (event) => {
  const message = event.data;
  console.log('Message received in ChatView:', message);
});
