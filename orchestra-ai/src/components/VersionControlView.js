 import React, { useState, useEffect, useRef } from 'react';
// Import Bootstrap JS
import 'bootstrap';
import { useSharedContext } from '../hooks/useSharedContext';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const VersionHistory = ({ versions, selectedVersions, onVersionSelect, onRevert, onViewDiff, onBack }) => {
  return (
    <div className="version-history">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Version History</h4>
        <div>
          <button
            className="btn btn-primary me-2"
            onClick={onViewDiff}
            disabled={selectedVersions.length !== 2}
          >
            View Diff
          </button>
          <button className="btn btn-secondary" onClick={onBack}>Back</button>
        </div>
      </div>
      <ul className="list-group">
        {versions.map((version) => (
          <li
            key={version.version}
            className={`list-group-item ${selectedVersions.includes(version.version) ? 'active' : ''}`}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <input
                  type="checkbox"
                  checked={selectedVersions.includes(version.version)}
                  onChange={() => onVersionSelect(version.version)}
                  className="me-2"
                />
                {new Date(version.timestamp).toLocaleString()}
              </div>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => onRevert(version.version)}
              >
                Revert
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const FileContent = ({ filePath, content, onBack }) => {
  const getLanguage = (path) => {
    const extension = path.split('.').pop().toLowerCase();
    switch (extension) {
      case 'js': return 'javascript';
      case 'py': return 'python';
      case 'html': return 'html';
      case 'css': return 'css';
      default: return 'text';
    }
  };

  return (
    <div className="file-content">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>{filePath}</h4>
        <button className="btn btn-secondary" onClick={onBack}>Back</button>
      </div>
      <SyntaxHighlighter language={getLanguage(filePath)} style={vs2015}>
        {content}
      </SyntaxHighlighter>
    </div>
  );
};

const FileTree = ({ fileSystem, onFileSelect }) => {
  const renderTree = (tree, path = '') => {
    return Object.entries(tree).map(([key, value]) => {
      const fullPath = path ? `${path}/${key}` : key;
      if (typeof value === 'object' && !value.content) {
        // This is a directory
        return (
          <li key={fullPath} className="mb-2">
            <span className="folder-name">{key}</span>
            <ul className="list-unstyled ms-3">
              {renderTree(value, fullPath)}
            </ul>
          </li>
        );
      } else {
        // This is a file
        return (
          <li key={fullPath} className="mb-1">
            <button
              className="btn btn-link p-0 text-decoration-none"
              onClick={() => onFileSelect(fullPath)}
            >
              {key}
            </button>
          </li>
        );
      }
    });
  };

  return (
    <div className="file-tree">
      <ul className="list-unstyled">
        {renderTree(fileSystem)}
      </ul>
    </div>
  );
};

const VersionControlView = () => {
  
  const [versionControlState, updateVersionControlState, vscode] = useSharedContext('versionControlView');
  const { fileSystem } = versionControlState || { fileSystem: {} };

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedVersions, setSelectedVersions] = useState([]);
  const [viewMode, setViewMode] = useState('tree'); // 'tree', 'content', 'history'

  const handleFileSelect = (filePath) => {
    setSelectedFile(filePath);
    setViewMode('content');
  };

  const handleVersionSelect = (version) => {
    setSelectedVersions((prev) => {
      if (prev.includes(version)) {
        return prev.filter((v) => v !== version);
      }
      return [...prev.slice(-1), version]; // Keep at most 2 versions selected
    });
  };

  const handleRevert = (version) => {
    updateVersionControlState((prevState) => {
      const fileVersions = prevState.fileSystem[selectedFile].versions;
      const revertedContent = fileVersions.find((v) => v.version === version).content;
      
      return {
        ...prevState,
        fileSystem: {
          ...prevState.fileSystem,
          [selectedFile]: {
            ...prevState.fileSystem[selectedFile],
            content: revertedContent,
            versions: [
              {
                version: Date.now(),
                content: revertedContent,
                timestamp: new Date().toISOString()
              },
              ...fileVersions
            ]
          }
        }
      };
    });
  };

  const handleViewDiff = () => {
    if (selectedVersions.length !== 2) return;

    const [oldVersion, newVersion] = selectedVersions.map(version => 
      fileSystem[selectedFile].versions.find(v => v.version === version)
    );

    vscode.postMessage({
      command: 'viewDiff',
      oldVersion: {
        content: oldVersion.content,
        fileName: `${selectedFile} (${new Date(oldVersion.timestamp).toLocaleString()})`,
      },
      newVersion: {
        content: newVersion.content,
        fileName: `${selectedFile} (${new Date(newVersion.timestamp).toLocaleString()})`,
      },
    });
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'content':
        return (
          <FileContent
            filePath={selectedFile}
            content={fileSystem[selectedFile]?.content}
            onBack={() => setViewMode('tree')}
          />
        );
      case 'history':
        return (
          <VersionHistory
            versions={fileSystem[selectedFile]?.versions || []}
            selectedVersions={selectedVersions}
            onVersionSelect={handleVersionSelect}
            onRevert={handleRevert}
            onViewDiff={handleViewDiff}
            onBack={() => setViewMode('content')}
          />
        );
      default:
        return (
          <FileTree
            fileSystem={fileSystem}
            onFileSelect={handleFileSelect}
          />
        );
    }
  };

  return (
    <div className="version-control-view container mt-4">
      <h2 className="mb-4">Version Control</h2>
      {renderContent()}
    </div>
  );
};

export default VersionControlView;