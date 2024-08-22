import React from 'react';
import PropTypes from 'prop-types';

/**
 * @typedef {Object} ButtonProps
 * @property {React.ReactNode} children - The content inside the button.
 * @property {'sm' | 'md' | 'lg'} [size] - The size of the button.
 * @property {'outline' | 'solid' | 'destructive'} [variant] - The variant of the button.
 * @property {string} [className] - Additional CSS classes to apply to the button.
 * @property {React.MouseEventHandler<HTMLButtonElement>} [onClick] - Callback function to handle button clicks.
 * @property {React.MouseEventHandler<HTMLButtonElement>} [onMouseDown] - Callback function to handle mouse down events.
 * @property {React.MouseEventHandler<HTMLButtonElement>} [onMouseUp] - Callback function to handle mouse up events.
 * @property {React.MouseEventHandler<HTMLButtonElement>} [onMouseLeave] - Callback function to handle mouse leave events.
 * @property {React.Ref<HTMLButtonElement>} [ref] - Ref for the button element.
 * @property {boolean} [disabled] - If true, disables the button.
 */

/**
 * Button component
 * @type {React.ForwardRefExoticComponent<Omit<ButtonProps & React.RefAttributes<HTMLButtonElement>, "ref"> & React.RefAttributes<HTMLButtonElement>>}
 */
export const Button = React.forwardRef(
  (
    { 
      children, 
      size = 'md', 
      variant = 'solid', 
      className, 
      onClick, 
      onMouseDown, 
      onMouseUp, 
      onMouseLeave, 
      disabled, 
      ...props 
    }, 
    ref
  ) => {
    const sizeClass = size === 'sm' ? 'btn-sm' : '';
    let variantClass = '';

    switch (variant) {
      case 'outline':
        variantClass = 'btn-outline-primary';
        break;
      case 'destructive':
        variantClass = 'btn-danger'; // Use Bootstrap's `btn-danger` for destructive actions
        break;
      default:
        variantClass = 'btn-primary';
        break;
    }

    return (
      <button
        ref={ref}
        className={`btn ${sizeClass} ${variantClass} ${className || ''}`}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

Button.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  variant: PropTypes.oneOf(['outline', 'solid', 'destructive']),
  className: PropTypes.string,
  onClick: PropTypes.func,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  onMouseLeave: PropTypes.func,
  disabled: PropTypes.bool,
};
