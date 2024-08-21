import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const TreeContext = createContext({});

export const Tree = ({ children }) => {
  return (
    <TreeContext.Provider value={{}}>
      <ul className="list-unstyled">{children}</ul>
    </TreeContext.Provider>
  );
};

Tree.propTypes = {
  children: PropTypes.node.isRequired,
};

export const TreeItem = ({ id, key, label, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const hasChildren = React.Children.count(children) > 0;

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <li key={key}>
      <div className="d-flex align-items-center">
        {hasChildren && (
          <button
            className="btn btn-sm me-2"
            onClick={toggleOpen}
            aria-expanded={isOpen}
          >
            {isOpen ? '▼' : '▶'}
          </button>
        )}
        <span>{label}</span>
      </div>
      {hasChildren && isOpen && (
        <ul className="list-unstyled ms-4 mt-2">{children}</ul>
      )}
    </li>
  );
};

TreeItem.propTypes = {
  id: PropTypes.string.isRequired,
  key: PropTypes.string,
  label: PropTypes.string.isRequired,
  children: PropTypes.node,
};

// Custom CSS to be added to your project
const treeStyles = `
.tree-item {
  cursor: pointer;
}
.tree-item:hover {
  background-color: #f8f9fa;
}
`;