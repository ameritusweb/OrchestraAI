import React from 'react';
import PropTypes from 'prop-types';

/**
 * Checkbox component that renders a styled checkbox input with a label.
 *
 * @type {React.ForwardRefExoticComponent<React.PropsWithoutRef<CheckboxProps> & React.RefAttributes<HTMLInputElement>>}
 * @param {CheckboxProps} props - The props for the component.
 * @param {React.Ref<HTMLInputElement>} ref - The ref to attach to the checkbox input element.
 * @returns {JSX.Element} The rendered checkbox component.
 */
export const Checkbox = React.forwardRef(
  ({ id, checked, onCheckedChange, className, ...props }, ref) => {
    return (
      <div className={`form-check ${className || ''}`}>
        <input
          type="checkbox"
          className="form-check-input"
          id={id}
          checked={checked}
          onChange={(e) => onCheckedChange(e.target.checked)}
          ref={ref}
          {...props}
        />
        <label className="form-check-label" htmlFor={id}>
          {props.label}
        </label>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onCheckedChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  label: PropTypes.string,
};

Checkbox.defaultProps = {
  checked: false,
};

/**
 * @typedef {Object} CheckboxProps
 * @property {string} id - The ID for the checkbox input and label.
 * @property {boolean} [checked=false] - Whether the checkbox is checked.
 * @property {function(boolean): void} onCheckedChange - Callback function to handle changes in the checkbox state.
 * @property {string} [className] - Additional CSS classes to apply to the checkbox container.
 * @property {string} [label] - The label text to display next to the checkbox.
 */


// Additional CSS for custom styling (optional)
const checkboxStyles = `
.form-check-input:checked {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.form-check-input:focus {
  border-color: #86b7fe;
  outline: 0;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}
`;