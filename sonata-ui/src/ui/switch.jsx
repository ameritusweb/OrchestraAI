import React from 'react';
import PropTypes from 'prop-types';

export const Switch = ({ id, checked, onCheckedChange }) => {
  return (
    <div className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        role="switch"
        id={id}
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
      />
    </div>
  );
};

Switch.propTypes = {
  id: PropTypes.string,
  checked: PropTypes.bool.isRequired,
  onCheckedChange: PropTypes.func.isRequired,
};