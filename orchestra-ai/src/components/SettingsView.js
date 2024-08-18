import React, { useState } from 'react';
// Import Bootstrap JS
import 'bootstrap';
import { useSharedContext } from '../hooks/useSharedContext';

const standardsCategories = [
  'Naming Conventions',
  'Code Style',
  'Documentation',
  'Error Handling',
  'Performance',
  'Security',
  'Best Practices',
  'Testing',
  'Tooling',
  'Styling and Design',
  'File and Folder Naming',
  'Project Structure',
  'Data Management'
];

const SettingsView = () => {
  const [standardsState, updateStandardsState] = useSharedContext('settingsView');
  const { standards } = standardsState || { standards: {} };

  const [activeCategory, setActiveCategory] = useState(standardsCategories[0]);
  const [editingStandard, setEditingStandard] = useState(null);

  const handleEditStandard = (category, key) => {
    setEditingStandard({ category, key, value: standards[category][key] });
  };

  return (
    <div className="standards-view container mt-4">
      <h2 className="mb-4">Coding Standards</h2>

      <div className="row">
        <div className="col-md-3">
          <ul className="list-group">
            {standardsCategories.map(category => (
              <li
                key={category}
                className={`list-group-item ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-9">
          <h3>{activeCategory}</h3>
          {standards[activeCategory] && Object.entries(standards[activeCategory]).map(([key, value]) => (
            <div key={key} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">{key}</h5>
                <p className="card-text">{value}</p>
                <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditStandard(activeCategory, key)}>
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;