 import React, { useState, useEffect, useCallback, useRef } from 'react';
// Import Bootstrap JS
import 'bootstrap';
import { useSharedContext } from '../hooks/useSharedContext';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const FileEditor = ({ filePath, content, onSave, onCancel }) => {
  const [editedContent, setEditedContent] = useState(content);

  const handleSave = () => {
    onSave(filePath, editedContent);
  };

  return (
    <div className="file-editor">
      <h3>Editing: {filePath}</h3>
      <textarea
        className="form-control mb-3"
        value={editedContent}
        onChange={(e) => setEditedContent(e.target['value'])}
        rows={20}
      />
      <button className="btn btn-primary me-2" onClick={handleSave}>Save</button>
      <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
    </div>
  );
};

const ImportFile = ({ onClose, onImport, fileSystem, postMessage }) => {
  const [destinationFolder, setDestinationFolder] = useState('');

  const handleImport = () => {
    postMessage({
      command: 'importFile',
      destinationFolder: destinationFolder
    });
  };

  const renderFolderOptions = (obj, path = '') => {
    return Object.entries(obj).flatMap(([key, value]) => {
      if (typeof value === 'object' && !value.content && !value.versions) {
        const fullPath = path ? `${path}/${key}` : key;
        return [
          <option key={fullPath} value={fullPath}>{fullPath}</option>,
          ...renderFolderOptions(value, fullPath)
        ];
      }
      return [];
    });
  };

  return (
    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Import File</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="destinationFolder" className="form-label">Destination Folder</label>
              <select
                className="form-select"
                id="destinationFolder"
                value={destinationFolder}
                onChange={(e) => setDestinationFolder(e.target['value'])}
              >
                <option value="">Root</option>
                {renderFolderOptions(fileSystem)}
              </select>
            </div>
            <div className="d-flex justify-content-end">
              <button type="button" className="btn btn-secondary me-2" onClick={onClose}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={handleImport}>Import</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CreateFileFolder = ({ onClose, onCreate, fileSystem }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('file');
  const [parentFolder, setParentFolder] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name) {
      onCreate(name, type, parentFolder);
    }
  };

  const isFolder = (obj) => typeof obj === 'object' && !obj.content && !obj.versions;

  const renderFolderOptions = (obj, path = '') => {
    return Object.entries(obj).flatMap(([key, value]) => {
      if (isFolder(value)) {
        const fullPath = path ? `${path}/${key}` : key;
        return [
          <option key={fullPath} value={fullPath}>{fullPath}</option>,
          ...renderFolderOptions(value, fullPath)
        ];
      }
      return [];
    });
  };

  return (
    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create New File/Folder</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target['value'])}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Type</label>
                <div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="type"
                      id="typeFile"
                      value="file"
                      checked={type === 'file'}
                      onChange={() => setType('file')}
                    />
                    <label className="form-check-label" htmlFor="typeFile">File</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="type"
                      id="typeFolder"
                      value="folder"
                      checked={type === 'folder'}
                      onChange={() => setType('folder')}
                    />
                    <label className="form-check-label" htmlFor="typeFolder">Folder</label>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="parentFolder" className="form-label">Parent Folder</label>
                <select
                  className="form-select"
                  id="parentFolder"
                  value={parentFolder}
                  onChange={(e) => setParentFolder(e.target['value'])}
                >
                  <option value="">Root</option>
                  {renderFolderOptions(fileSystem)}
                </select>
              </div>
              <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-secondary me-2" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const RenameFileFolder = ({ path, onClose, onRename }) => {
  const [newName, setNewName] = useState(path.split('/').pop());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newName && newName !== path.split('/').pop()) {
      onRename(path, newName);
    }
  };

  return (
    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Rename File/Folder</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="newName" className="form-label">New Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="newName"
                  value={newName}
                  onChange={(e) => setNewName(e.target['value'])}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Rename</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const VersionHistory = ({ 
  versions, 
  selectedVersions, 
  onVersionSelect, 
  onRevert, 
  onViewDiff, 
  onAddTag,
  onBack 
}) => {
  const [tagInput, setTagInput] = useState('');
  const [tagVersion, setTagVersion] = useState(null);

  const handleAddTag = (version) => {
    if (tagInput.trim()) {
      onAddTag(version, tagInput.trim());
      setTagInput('');
      setTagVersion(null);
    }
  };

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
                {version.tag && <span className="badge bg-info ms-2">{version.tag}</span>}
              </div>
              <div>
                {tagVersion === version.version ? (
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target['value'])}
                      placeholder="Enter tag"
                    />
                    <button className="btn btn-outline-secondary" onClick={() => handleAddTag(version.version)}>Add</button>
                    <button className="btn btn-outline-secondary" onClick={() => setTagVersion(null)}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <button
                      className="btn btn-sm btn-outline-info me-2"
                      onClick={() => setTagVersion(version.version)}
                    >
                      Tag
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => onRevert(version.version)}
                    >
                      Revert
                    </button>
                  </>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const FileContent = ({ filePath, content, onBack, onViewHistory, onRename, onDelete }) => {
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
        <div>
          <button className="btn btn-secondary me-2" onClick={onBack}>Back</button>
          <button className="btn btn-info me-2" onClick={onViewHistory}>View History</button>
          <button className="btn btn-warning me-2" onClick={onRename}>Rename</button>
          <button className="btn btn-danger" onClick={onDelete}>Delete</button>
        </div>
      </div>
      <SyntaxHighlighter language={getLanguage(filePath)} style={vs2015}>
        {content}
      </SyntaxHighlighter>
    </div>
  );
};

const FileTree = ({ fileSystem, onFileSelect, onDelete, onRename, onEdit, onViewHistory, filter, vscode }) => {
  const renderTree = (tree, path = '') => {
    return Object.entries(tree)
      .filter(([key]) => key.toLowerCase().includes(filter.toLowerCase()))
      .map(([key, value]) => {
        const fullPath = path ? `${path}/${key}` : key;
        const isFile = typeof value === 'object' && value.content !== undefined;

        if (!isFile) {
          // This is a directory
          return (
            <li key={fullPath} className="mb-2">
              <div className="d-flex align-items-center">
                <span className="folder-name">{key}</span>
                <button className="btn btn-sm btn-outline-danger ms-2" onClick={() => onDelete(fullPath)}>Delete</button>
                <button className="btn btn-sm btn-outline-secondary ms-2" onClick={() => onRename(fullPath)}>Rename</button>
              </div>
              <ul className="list-unstyled ms-3">
                {renderTree(value, fullPath)}
              </ul>
            </li>
          );
        } else {
          // This is a file
          return (
            <li key={fullPath} className="mb-1">
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-link p-0 text-decoration-none"
                  onClick={() => onFileSelect(fullPath)}
                >
                  {key}
                </button>
                <button className="btn btn-sm btn-outline-primary ms-2" onClick={() => handleViewFile(fullPath)}>View</button>
                <button className="btn btn-sm btn-outline-success ms-2" onClick={() => onEdit(fullPath)}>Edit</button>
                <button className="btn btn-sm btn-outline-info ms-2" onClick={() => onViewHistory(fullPath)}>History</button>
                <button className="btn btn-sm btn-outline-danger ms-2" onClick={() => onDelete(fullPath)}>Delete</button>
                <button className="btn btn-sm btn-outline-secondary ms-2" onClick={() => onRename(fullPath)}>Rename</button>
              </div>
            </li>
          );
        }
      });
  };

  const handleViewFile = (filePath) => {
    vscode.postMessage({
      command: 'viewFile',
      filePath: filePath
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
  const [fileFilter, setFileFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const handleFileSelect = (filePath) => {
    setSelectedFile(filePath);
    setViewMode('content');
  };

  const handleViewHistory = useCallback(() => {
    setViewMode('history');
  }, []);

  const handleAddVersionTag = useCallback((version, tag) => {
    updateVersionControlState((prevState) => {
      const fileVersions = prevState.fileSystem[selectedFile].versions;
      const updatedVersions = fileVersions.map(v => 
        v.version === version ? { ...v, tag } : v
      );

      return {
        ...prevState,
        fileSystem: {
          ...prevState.fileSystem,
          [selectedFile]: {
            ...prevState.fileSystem[selectedFile],
            versions: updatedVersions
          }
        }
      };
    });

    vscode.postMessage({
      command: 'showNotification',
      type: 'info',
      message: `Tag '${tag}' added to version from ${new Date(version).toLocaleString()}`
    });
  }, [selectedFile, updateVersionControlState]);

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

  const handleEdit = useCallback((filePath) => {
    setSelectedFile(filePath);
    setViewMode('edit');
  }, []);

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

  const handleCreateFileFolder = useCallback((name, type, parentFolder = '') => {
    updateVersionControlState((prevState) => {
      const newFileSystem = { ...prevState.fileSystem };
      const fullPath = parentFolder ? `${parentFolder}/${name}` : name;

      // Helper function to set nested object properties
      const setNestedProperty = (obj, path, value) => {
        const keys = path.split('/');
        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) {
            current[keys[i]] = {};
          }
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
      };

      if (type === 'file') {
        setNestedProperty(newFileSystem, fullPath, { content: '', versions: [] });
      } else {
        setNestedProperty(newFileSystem, fullPath, {});
      }

      vscode.postMessage({
        command: 'showNotification',
        type: 'info',
        message: `${type === 'file' ? 'File' : 'Folder'} '${fullPath}' created successfully`
      });

      return { ...prevState, fileSystem: newFileSystem };
    });

    setShowCreateModal(false);
  }, [updateVersionControlState]);

  const handleDeleteFileFolder = useCallback((path) => {
    if (window.confirm(`Are you sure you want to delete '${path}'?`)) {
      updateVersionControlState((prevState) => {
        const newFileSystem = { ...prevState.fileSystem };
        delete newFileSystem[path];

        vscode.postMessage({
          command: 'showNotification',
          type: 'info',
          message: `'${path}' deleted successfully`
        });

        return { ...prevState, fileSystem: newFileSystem };
      });
    }
  }, [updateVersionControlState]);

  const handleRenameFileFolder = useCallback((oldPath, newName) => {
    updateVersionControlState((prevState) => {
      const newFileSystem = { ...prevState.fileSystem };
      const newPath = oldPath.split('/').slice(0, -1).concat(newName).join('/');

      newFileSystem[newPath] = newFileSystem[oldPath];
      delete newFileSystem[oldPath];

      vscode.postMessage({
        command: 'showNotification',
        type: 'info',
        message: `'${oldPath}' renamed to '${newPath}' successfully`
      });

      return { ...prevState, fileSystem: newFileSystem };
    });

    setShowRenameModal(false);
  }, [updateVersionControlState]);

  const handleImportFile = useCallback((importedFile) => {
    updateVersionControlState((prevState) => {
      const newFileSystem = { ...prevState.fileSystem };
      const { path, content } = importedFile;

      // Helper function to set nested object properties
      const setNestedProperty = (obj, path, value) => {
        const keys = path.split('/');
        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) {
            current[keys[i]] = {};
          }
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
      };

      setNestedProperty(newFileSystem, path, { content, versions: [] });

      vscode.postMessage({
        command: 'showNotification',
        type: 'info',
        message: `File '${path}' imported successfully`
      });

      return { ...prevState, fileSystem: newFileSystem };
    });

    setShowImportModal(false);
  }, [updateVersionControlState]);

  useEffect(() => {
    const handleMessage = (event) => {
      const message = event.data;
      switch (message.command) {
        case 'importedFile':
          handleImportFile(message.file);
          break;
        // ... handle other messages ...
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handleImportFile]);

  const handleSave = useCallback((filePath, content) => {
    updateVersionControlState((prevState) => {
      const newFileSystem = { ...prevState.fileSystem };
      const file = newFileSystem[filePath];
      const newVersion = {
        content,
        timestamp: new Date().toISOString(),
        version: Date.now()
      };
      file.content = content;
      file.versions = [newVersion, ...(file.versions || [])];
      return { ...prevState, fileSystem: newFileSystem };
    });
    setViewMode('content');
  }, [updateVersionControlState]);

  const renderContent = () => {
    switch (viewMode) {
      case 'content':
        return (
          <FileContent
            filePath={selectedFile}
            content={fileSystem[selectedFile]?.content}
            onBack={() => setViewMode('tree')}
            onViewHistory={handleViewHistory}
            onRename={() => setShowRenameModal(true)}
            onDelete={() => handleDeleteFileFolder(selectedFile)}
          />
        );
        case 'edit':
          return (
            <FileEditor
              filePath={selectedFile}
              content={fileSystem[selectedFile]?.content}
              onSave={handleSave}
              onCancel={() => setViewMode('tree')}
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
            onAddTag={handleAddVersionTag}
            onBack={() => setViewMode('content')}
          />
        );
        default:
          return (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <input
                  type="text"
                  className="form-control w-50"
                  placeholder="Filter files..."
                  value={fileFilter}
                  onChange={(e) => setFileFilter(e.target['value'])}
                />
                <div>
                  <button className="btn btn-primary me-2" onClick={() => setShowCreateModal(true)}>
                    Create New
                  </button>
                  <button className="btn btn-secondary" onClick={() => setShowImportModal(true)}>
                    Import File
                  </button>
                </div>
              </div>
              <FileTree
                fileSystem={fileSystem}
                onFileSelect={handleFileSelect}
                onEdit={handleEdit}
                onViewHistory={handleViewHistory}
                onDelete={handleDeleteFileFolder}
                onRename={() => setShowRenameModal(true)}
                filter={fileFilter}
                vscode={vscode}
              />
            </>
          );
      }
    };

  return (
    <div className="version-control-view container mt-4">
      <h2 className="mb-4">Version Control</h2>
      {renderContent()}
      {showCreateModal && (
        <CreateFileFolder
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateFileFolder}
          fileSystem={fileSystem}
        />
      )}
      {showRenameModal && (
        <RenameFileFolder
          path={selectedFile}
          onClose={() => setShowRenameModal(false)}
          onRename={handleRenameFileFolder}
        />
      )}
      {showImportModal && (
        <ImportFile
          onClose={() => setShowImportModal(false)}
          onImport={handleImportFile}
          fileSystem={fileSystem}
          postMessage={vscode.postMessage}
        />
      )}
    </div>
  );
};

export default VersionControlView;