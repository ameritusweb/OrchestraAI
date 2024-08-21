import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const SelectContext = createContext({
    value: '',
    onValueChange: (value) => {},
    isOpen: false,
    setIsOpen: (isOpen) => {},
  });

export const Select = ({ children, value, onValueChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SelectContext.Provider value={{ value, onValueChange, isOpen, setIsOpen }}>
      <div className="dropdown">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

Select.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.string,
  onValueChange: PropTypes.func.isRequired,
};

export const SelectTrigger = ({ className, children }) => {
  const { isOpen, setIsOpen } = useContext(SelectContext);

  return (
    <button
      className={`btn btn-secondary dropdown-toggle w-100 text-start ${className}`}
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      aria-expanded={isOpen}
    >
      {children}
    </button>
  );
};

SelectTrigger.propTypes = {
    className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export const SelectValue = ({ placeholder }) => {
  const { value } = useContext(SelectContext);

  return <span>{value || placeholder}</span>;
};

SelectValue.propTypes = {
  placeholder: PropTypes.string,
};

export const SelectContent = ({ children }) => {
  const { isOpen } = useContext(SelectContext);

  return (
    <ul className={`dropdown-menu w-100 ${isOpen ? 'show' : ''}`}>
      {children}
    </ul>
  );
};

SelectContent.propTypes = {
  children: PropTypes.node.isRequired,
};

export const SelectItem = ({ children, key, value }) => {
  const { onValueChange, setIsOpen } = useContext(SelectContext);

  const handleClick = () => {
    onValueChange(value);
    setIsOpen(false);
  };

  return (
    <li key={key}>
      <a className="dropdown-item" href="#" onClick={handleClick}>
        {children}
      </a>
    </li>
  );
};

SelectItem.propTypes = {
  children: PropTypes.node.isRequired,
  key: PropTypes.string,
  value: PropTypes.string.isRequired,
};
