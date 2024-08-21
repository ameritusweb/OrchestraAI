import React from 'react';
import PropTypes from 'prop-types';

/**
 * Textarea component that renders a styled textarea element.
 *
 * @type {React.ForwardRefExoticComponent<React.PropsWithoutRef<TextareaProps> & React.RefAttributes<HTMLTextAreaElement>>}
 * @param {TextareaProps} props - The props for the component.
 * @param {React.Ref<HTMLTextAreaElement>} ref - The ref to attach to the textarea element.
 * @returns {JSX.Element} The rendered textarea element.
 */
export const Textarea = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={`form-control ${className || ''}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

Textarea.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

/**
 * @typedef {Object} TextareaProps
 * @property {string} [className] - Additional CSS classes to apply to the textarea.
 * @property {string} [placeholder] - Placeholder text for the textarea.
 * @property {string} [value] - The value of the textarea.
 * @property {React.ChangeEventHandler<HTMLTextAreaElement>} [onChange] - Callback function to handle textarea changes.
 */
