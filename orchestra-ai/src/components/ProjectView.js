import React from 'react';
// Import Bootstrap JS
import 'bootstrap';
import { useSharedContext } from '../hooks/useSharedContext';

const ProjectView = () => {
  const [projectState, updateProjectState] = useSharedContext('projectView');

  const {
    name,
    description,
    language,
    framework,
    tools,
    aiModel,
    codingStandards
  } = projectState || {};

  const handleNameChange = (e) => {
    updateProjectState(prevState => ({
      ...prevState,
      name: e.target.value
    }));
  };

  const handleDescriptionChange = (e) => {
    updateProjectState(prevState => ({
      ...prevState,
      description: e.target.value
    }));
  };

  return (
    <div className="project-view container mt-4">
      <h2 className="mb-4">Project Details</h2>
      <form>
        <div className="mb-3">
          <label htmlFor="project-name" className="form-label">Name:</label>
          <input
            id="project-name"
            type="text"
            className="form-control"
            value={name || ''}
            onChange={handleNameChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="project-description" className="form-label">Description:</label>
          <textarea
            id="project-description"
            className="form-control"
            value={description || ''}
            onChange={handleDescriptionChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="project-language" className="form-label">Language:</label>
          <span id="project-language" className="form-control-plaintext">{language}</span>
        </div>
        <div className="mb-3">
          <label htmlFor="project-framework" className="form-label">Framework:</label>
          <span id="project-framework" className="form-control-plaintext">{framework}</span>
        </div>
        <div className="mb-3">
          <label htmlFor="project-tools" className="form-label">Tools:</label>
          <ul id="project-tools" className="list-group">
            {tools && tools.map((tool, index) => (
              <li key={index} className="list-group-item">{tool}</li>
            ))}
          </ul>
        </div>
        <div className="mb-3">
          <label htmlFor="project-ai-model" className="form-label">AI Model:</label>
          <span id="project-ai-model" className="form-control-plaintext">{aiModel}</span>
        </div>
        <div className="mb-3">
          <label htmlFor="project-coding-standards" className="form-label">Coding Standards:</label>
          <pre id="project-coding-standards" className="form-control-plaintext">{codingStandards}</pre>
        </div>
      </form>
    </div>
  );
};

export default ProjectView;