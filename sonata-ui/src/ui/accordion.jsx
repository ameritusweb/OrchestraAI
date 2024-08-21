import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const AccordionContext = createContext({
    itemValue: '', // Default value for the item
    openItems: new Set(), // Default value for the open items
    toggleItem: (itemId) => {}, // No-op function as a placeholder
    type: 'single', // Default value for the accordion type
    isOpen: false, // Default value for the item open state
});

export const Accordion = ({ type, children }) => {
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = (itemId) => {
    setOpenItems((prevOpenItems) => {
      const newOpenItems = new Set(prevOpenItems);
      if (type === "single") {
        newOpenItems.clear();
      }
      if (newOpenItems.has(itemId)) {
        newOpenItems.delete(itemId);
      } else {
        newOpenItems.add(itemId);
      }
      return newOpenItems;
    });
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, type, isOpen: false, itemValue: '' }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
};

Accordion.propTypes = {
  type: PropTypes.oneOf(['single', 'multiple']).isRequired,
  children: PropTypes.node.isRequired,
};

export const AccordionItem = ({ key, value, children }) => {
  const { openItems } = useContext(AccordionContext);
  const isOpen = openItems.has(value);

  return (
    <div key={key} className="accordion-item">
      <AccordionContext.Provider value={{ ...useContext(AccordionContext), itemValue: value, isOpen }}>
        {children}
      </AccordionContext.Provider>
    </div>
  );
};

AccordionItem.propTypes = {
  key: PropTypes.string,
  value: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export const AccordionTrigger = ({ children }) => {
  const { itemValue, isOpen, toggleItem } = useContext(AccordionContext);

  return (
    <h2 className="accordion-header">
      <button
        className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
        type="button"
        onClick={() => toggleItem(itemValue)}
        aria-expanded={isOpen}
      >
        {children}
      </button>
    </h2>
  );
};

AccordionTrigger.propTypes = {
  children: PropTypes.node.isRequired,
};

export const AccordionContent = ({ children }) => {
  const { itemValue, isOpen } = useContext(AccordionContext);

  return (
    <div
      id={`accordion-${itemValue}`}
      className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}
    >
      <div className="accordion-body">{children}</div>
    </div>
  );
};

AccordionContent.propTypes = {
  children: PropTypes.node.isRequired,
};