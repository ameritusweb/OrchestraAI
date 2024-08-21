import React from 'react';
import PropTypes from 'prop-types';

// DropdownMenu components
export const DropdownMenu = ({ children }) => {
  return <div className="dropdown">{children}</div>;
};

DropdownMenu.propTypes = {
  children: PropTypes.node.isRequired,
};

export const DropdownMenuTrigger = ({ asChild, children }) => {
  const TriggerComponent = asChild ? React.Children.only(children).type : 'button';
  
  return (
    <TriggerComponent
      className="dropdown-toggle"
      type="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      {children}
    </TriggerComponent>
  );
};

DropdownMenuTrigger.propTypes = {
  asChild: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export const DropdownMenuContent = ({ children }) => {
  return <ul className="dropdown-menu">{children}</ul>;
};

DropdownMenuContent.propTypes = {
  children: PropTypes.node.isRequired,
};

export const DropdownMenuItem = ({ onSelect, children }) => {
  return (
    <li>
      <a className="dropdown-item" href="#" onClick={(e) => {
        e.preventDefault();
        onSelect();
      }}>
        {children}
      </a>
    </li>
  );
};

DropdownMenuItem.propTypes = {
  onSelect: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};