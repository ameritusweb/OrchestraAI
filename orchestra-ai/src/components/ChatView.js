 import React, { useState, useEffect, useRef } from 'react';
// Import Bootstrap JS
import 'bootstrap';
import { useSharedContext } from '../hooks/useSharedContext';

const ChatView = () => {
  const [chatState, updateChatState, vscode] = useSharedContext('chatView');
  const { messages, selectedModel, context, useLocalApi, localApiEndpoint } = chatState || {
    messages: [],
    selectedModel: 'gpt-4o',
    context: '',
    useLocalApi: false,
    localApiEndpoint: 'http://localhost:5000/api/languagemodel'
  };

  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [availableModels, setAvailableModels] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!useLocalApi) {
      vscode.postMessage({ command: 'getAvailableModels' });
    }
  }, [useLocalApi]);

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
          setIsLoading(false);
          break;
        case 'error':
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
      context: context,
      useLocalApi: useLocalApi,
      localApiEndpoint: localApiEndpoint
    });
  };

  const handleModelChange = (event) => {
    updateChatState(prevState => ({
      ...prevState,
      selectedModel: event.target.value
    }));
  };

  const handleApiToggle = () => {
    updateChatState(prevState => ({
      ...prevState,
      useLocalApi: !prevState.useLocalApi
    }));
  };

  const handleLocalApiEndpointChange = (event) => {
    updateChatState(prevState => ({
      ...prevState,
      localApiEndpoint: event.target.value
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
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="apiToggle"
            checked={useLocalApi}
            onChange={handleApiToggle}
          />
          <label className="form-check-label" htmlFor="apiToggle">
            Use Local API
          </label>
        </div>
      </div>

      {useLocalApi ? (
        <div className="mb-3">
          <label htmlFor="local-api-endpoint" className="form-label">Local API Endpoint:</label>
          <input
            type="text"
            className="form-control"
            id="local-api-endpoint"
            value={localApiEndpoint}
            onChange={handleLocalApiEndpointChange}
          />
        </div>
      ) : (
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
      )}

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