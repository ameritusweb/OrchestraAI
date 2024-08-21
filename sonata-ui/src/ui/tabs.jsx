import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const TabsContext = createContext({
    activeTab: '', // Default value for the active tab
    setActiveTab: (tab) => {}, // No-op function as a placeholder
  });

export const Tabs = ({ defaultValue, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
};

Tabs.propTypes = {
  defaultValue: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export const TabsList = ({ children }) => {
  return (
    <ul className="nav nav-tabs mb-3" role="tablist">
      {children}
    </ul>
  );
};

TabsList.propTypes = {
  children: PropTypes.node.isRequired,
};

export const TabsTrigger = ({ value, children }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);

  return (
    <li className="nav-item" role="presentation">
      <button
        className={`nav-link ${activeTab === value ? 'active' : ''}`}
        id={`${value}-tab`}
        data-bs-toggle="tab"
        data-bs-target={`#${value}`}
        type="button"
        role="tab"
        aria-controls={value}
        aria-selected={activeTab === value}
        onClick={() => setActiveTab(value)}
      >
        {children}
      </button>
    </li>
  );
};

TabsTrigger.propTypes = {
  value: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export const TabsContent = ({ value, children }) => {
  const { activeTab } = useContext(TabsContext);

  return (
    <div
      className={`tab-pane fade ${activeTab === value ? 'show active' : ''}`}
      id={value}
      role="tabpanel"
      aria-labelledby={`${value}-tab`}
    >
      {children}
    </div>
  );
};

TabsContent.propTypes = {
  value: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};