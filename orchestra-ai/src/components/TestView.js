 import React, { useState, useEffect, useRef } from 'react';
// Import Bootstrap JS
import 'bootstrap';
import { useSharedContext } from '../hooks/useSharedContext';

const AssertTypes = {
  EQUALITY: 'equality',
  TYPE: 'type',
  RANGE: 'range',
  CUSTOM: 'custom'
};

const CustomAssertBuilderWithMessages = ({ onSave, onCancel }) => {
  const [assertName, setAssertName] = useState('');
  const [assertType, setAssertType] = useState(AssertTypes.EQUALITY);
  const [params, setParams] = useState({ actual: '', expected: '' });
  const [customCode, setCustomCode] = useState('');
  const [customMessage, setCustomMessage] = useState('');

  const generateAssertCode = () => {
    const messageParam = ', message';
    const messageUse = customMessage ? `message || '${customMessage}'` : 'message';

    switch (assertType) {
      case AssertTypes.EQUALITY:
        return `
          ${assertName}: (actual, expected${messageParam}) => {
            if (actual !== expected) {
              throw new Error(${messageUse} || \`Expected \${actual} to equal \${expected}\`);
            }
          }
        `;
      case AssertTypes.TYPE:
        return `
          ${assertName}: (value, type${messageParam}) => {
            if (typeof value !== type) {
              throw new Error(${messageUse} || \`Expected \${value} to be of type \${type}, but got \${typeof value}\`);
            }
          }
        `;
      case AssertTypes.RANGE:
        return `
          ${assertName}: (value, min, max${messageParam}) => {
            if (value < min || value > max) {
              throw new Error(${messageUse} || \`Expected \${value} to be between \${min} and \${max}\`);
            }
          }
        `;
      case AssertTypes.CUSTOM:
        return customCode;
      default:
        return '';
    }
  };

  const handleSave = () => {
    onSave({
      name: assertName,
      type: assertType,
      code: generateAssertCode(),
      customMessage
    });
  };

  return (
    <div className="custom-assert-builder">
      <h3>Custom Assert Builder</h3>
      <div className="mb-3">
        <label htmlFor="assertName" className="form-label">Assert Name</label>
        <input
          type="text"
          className="form-control"
          id="assertName"
          value={assertName}
          onChange={(e) => setAssertName(e.target['value'])}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="assertType" className="form-label">Assert Type</label>
        <select
          className="form-select"
          id="assertType"
          value={assertType}
          onChange={(e) => setAssertType(e.target['value'])}
        >
          <option value={AssertTypes.EQUALITY}>Equality</option>
          <option value={AssertTypes.TYPE}>Type Check</option>
          <option value={AssertTypes.RANGE}>Range Check</option>
          <option value={AssertTypes.CUSTOM}>Custom</option>
        </select>
      </div>
      {assertType === AssertTypes.CUSTOM ? (
        <div className="mb-3">
          <label htmlFor="customCode" className="form-label">Custom Assert Code</label>
          <textarea
            className="form-control"
            id="customCode"
            rows={5}
            value={customCode}
            onChange={(e) => setCustomCode(e.target['value'])}
          ></textarea>
        </div>
      ) : (
        <div className="mb-3">
          <label className="form-label">Parameters</label>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Actual"
            value={params.actual}
            onChange={(e) => setParams({...params, actual: e.target['value']})}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Expected"
            value={params.expected}
            onChange={(e) => setParams({...params, expected: e.target['value']})}
          />
        </div>
      )}
      <div className="mb-3">
        <label htmlFor="customMessage" className="form-label">Custom Error Message (optional)</label>
        <input
          type="text"
          className="form-control"
          id="customMessage"
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target['value'])}
          placeholder="Enter a custom error message"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Preview</label>
        <pre className="border p-2 bg-light">
          {generateAssertCode()}
        </pre>
      </div>
      <div className="mb-3">
        <button className="btn btn-primary me-2" onClick={handleSave}>Save Assert</button>
        <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

const TestView = () => {
  
  const [testState, updateTestState, vscode] = useSharedContext('testView');
  const { tests } = testState || { tests: [] };

  const [selectedTests, setSelectedTests] = useState([]);
  const [editingTest, setEditingTest] = useState(null);

  useEffect(() => {
    const messageHandler = (event) => {
      const message = event.data;
      switch (message.command) {
        case 'updateTests':
          updateTestState(prevState => ({
            ...prevState,
            tests: message.tests
          }));
          break;
        case 'testRunComplete':
          updateTestState(prevState => ({
            ...prevState,
            tests: prevState.tests.map(test => 
              message.results[test.id] ? { ...test, ...message.results[test.id] } : test
            )
          }));
          break;
      }
    };

    window.addEventListener('message', messageHandler);

    // Initial load of tests
    vscode.postMessage({ command: 'getTests' });

    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, []);

  const handleAddTest = () => {
    setEditingTest({ id: Date.now(), name: '', code: '' });
  };

  const handleEditTest = (test) => {
    setEditingTest(test);
  };

  const handleDeleteTest = (testId) => {
    vscode.postMessage({ command: 'deleteTest', testId });
  };

  const handleSaveTest = (test) => {
    vscode.postMessage({ command: 'saveTest', test });
    setEditingTest(null);
  };

  const handleRunTests = () => {
    vscode.postMessage({ command: 'runTests', testIds: selectedTests.length ? selectedTests : 'all' });
  };

  const handleTestSelection = (testId) => {
    setSelectedTests(prev => 
      prev.includes(testId) ? prev.filter(id => id !== testId) : [...prev, testId]
    );
  };

  return (
    <div className="test-view container mt-4">
      <h2 className="mb-4">Test View</h2>

      <div className="mb-3">
        <button className="btn btn-primary me-2" onClick={handleAddTest}>Add Test</button>
        <button className="btn btn-success" onClick={handleRunTests}>
          Run {selectedTests.length ? 'Selected' : 'All'} Tests
        </button>
      </div>

      <div className="test-list">
        {tests.map(test => (
          <div key={test.id} className={`card mb-3 ${test.status === 'passed' ? 'border-success' : test.status === 'failed' ? 'border-danger' : ''}`}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title">
                  <input
                    type="checkbox"
                    checked={selectedTests.includes(test.id)}
                    onChange={() => handleTestSelection(test.id)}
                    className="me-2"
                  />
                  {test.name}
                </h5>
                <span className={`badge ${test.status === 'passed' ? 'bg-success' : test.status === 'failed' ? 'bg-danger' : 'bg-secondary'}`}>
                  {test.status || 'Not Run'}
                </span>
              </div>
              {test.status === 'failed' && (
                <div className="mt-2">
                  <strong>Error:</strong>
                  <pre className="text-danger">{test.error}</pre>
                  <strong>Stack Trace:</strong>
                  <pre className="text-muted">{test.stackTrace}</pre>
                </div>
              )}
              <div className="mt-2">
                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditTest(test)}>Edit</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteTest(test.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingTest && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingTest.id ? 'Edit Test' : 'Add Test'}</h5>
                <button type="button" className="btn-close" onClick={() => setEditingTest(null)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="testName" className="form-label">Test Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="testName"
                    value={editingTest.name}
                    onChange={(e) => setEditingTest({...editingTest, name: e.target['value']})}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="testCode" className="form-label">Test Code</label>
                  <textarea
                    className="form-control"
                    id="testCode"
                    rows={5}
                    value={editingTest.code}
                    onChange={(e) => setEditingTest({...editingTest, code: e.target['value']})}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingTest(null)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={() => handleSaveTest(editingTest)}>Save Test</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestView;