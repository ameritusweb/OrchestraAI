import React from 'react';
import PropTypes from 'prop-types';

/**
 * Input component that renders a styled input element.
 *
 * @type {React.ForwardRefExoticComponent<React.PropsWithoutRef<InputProps> & React.RefAttributes<HTMLInputElement>>}
 * @param {InputProps} props - The props for the component.
 * @param {React.Ref<HTMLInputElement>} ref - The ref to attach to the input element.
 * @returns {JSX.Element} The rendered input element.
 */
export const Input = React.forwardRef(
  ({ className, id, type = 'text', ...props }, ref) => {
    return (
      <input
        id={id}
        type={type}
        className={`form-control ${className || ''}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

Input.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
};

/**
 * @typedef {Object} InputProps
 * @property {string} [className] - Additional CSS classes to apply to the input.
 * @property {string} [id] - The ID for the input element.
 * @property {string} [type='text'] - The type of the input (e.g., "text", "password").
 * @property {string} [value] - The value of the input.
 * @property {React.ChangeEventHandler<HTMLInputElement>} [onChange] - Callback function to handle input changes.
 * @property {string} [placeholder] - Placeholder text for the input.
 */
