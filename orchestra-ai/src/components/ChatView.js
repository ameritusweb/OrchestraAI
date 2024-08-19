 import React, { useState, useEffect, useRef } from 'react';
// Import Bootstrap JS
import 'bootstrap';
import { useSharedContext } from '../hooks/useSharedContext';

const ChatView = () => {
  const [chatState, updateChatState, vscode] = useSharedContext('chatView');
  const { messages, selectedModel, context } = chatState || { messages: [], selectedModel: 'gpt-4o', context: '' };

  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [availableModels, setAvailableModels] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Fetch available models when component mounts
    vscode.postMessage({ command: 'getAvailableModels' });
  }, []);

  useEffect(() => {
    const messageHandler = (event) => {
      const message = event.data;
      switch (message.command) {
        case 'availableModels':
          setAvailableModels(message.models);
          break;
        case 'appendResponse':
          updateChatState(prevState => ({
            ...prevState,
            messages: [...prevState.messages, { role: 'assistant', content: message.content }]
          }));
          break;
        case 'error':
          // Handle error messages
          console.error(message.error);
          setIsLoading(false);
          break;
      }
    };

    window.addEventListener('message', messageHandler);

    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, []);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessage = { role: 'user', content: userInput };
    updateChatState(prevState => ({
      ...prevState,
      messages: [...prevState.messages, newMessage]
    }));

    setUserInput('');
    setIsLoading(true);

    vscode.postMessage({
      command: 'sendMessage',
      message: userInput,
      model: selectedModel,
      context: context
    });
  };

  const handleModelChange = (event) => {
    updateChatState(prevState => ({
      ...prevState,
      selectedModel: event.target.value
    }));
  };

  const handleClearContext = () => {
    updateChatState(prevState => ({
      ...prevState,
      context: '',
      messages: []
    }));
  };

  const handleUpdateContext = () => {
    vscode.postMessage({ command: 'getActiveEditorContent' });
  };

  return (
    <div className="chat-view container mt-4">
      <h2 className="mb-4">AI Chat</h2>

      <div className="mb-3">
        <label htmlFor="model-select" className="form-label">Select AI Model:</label>
        <select
          id="model-select"
          className="form-select"
          value={selectedModel}
          onChange={handleModelChange}
        >
          {availableModels.map(model => (
            <option key={model.id} value={model.id}>{model.id}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <button className="btn btn-secondary me-2" onClick={handleClearContext}>Clear Context</button>
        <button className="btn btn-info" onClick={handleUpdateContext}>Use Active Editor Content as Context</button>
      </div>

      <div className="chat-messages border p-3 mb-3" style={{height: '400px', overflowY: 'auto'}}>
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.role === 'user' ? 'text-end' : ''}`}>
            <span className={`badge ${message.role === 'user' ? 'bg-primary' : 'bg-secondary'}`}>
              {message.role === 'user' ? 'You' : 'AI'}
            </span>
            <p className="mb-0">{message.content}</p>
          </div>
        ))}
        {isLoading && <div className="text-center">AI is thinking...</div>}
        <div ref={chatEndRef} />
      </div>

      <div className="input-group">
        <textarea
          className="form-control"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message here..."
          rows="3"
        />
        <button
          className="btn btn-primary"
          onClick={handleSendMessage}
          disabled={isLoading}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatView;