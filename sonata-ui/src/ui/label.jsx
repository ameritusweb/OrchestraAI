import React from 'react';
import PropTypes from 'prop-types';

export const Label = ({ htmlFor, children, className }) => {
    return (
      <label htmlFor={htmlFor} className={`form-check-label ${className || ''}`}>
        {children}
      </label>
    );
  };
  
  Label.propTypes = {
    htmlFor: PropTypes.string,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
  };