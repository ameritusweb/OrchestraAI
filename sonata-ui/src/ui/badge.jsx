import React from 'react';
import PropTypes from 'prop-types';

export const Badge = ({ variant, className, children, ...props }) => {
  const baseClass = 'badge';
  const variantClass = variant === 'outline' ? 'text-primary bg-light border border-primary' : 'bg-primary text-light';
  
  return (
    <span 
      className={`${baseClass} ${variantClass} ${className || ''}`}
      {...props}
    >
      {children}
    </span>
  );
};

Badge.propTypes = {
  variant: PropTypes.oneOf(['outline', 'default']),
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Badge.defaultProps = {
  variant: 'default',
};

// Additional CSS for custom styling
const badgeStyles = `
.badge {
  font-size: 0.75em;
  font-weight: 600;
  padding: 0.35em 0.65em;
  border-radius: 0.25rem;
}

.badge.text-primary.bg-light {
  background-color: transparent !important;
}

.mr-1 {
  margin-right: 0.25rem !important;
}

.mb-1 {
  margin-bottom: 0.25rem !important;
}
`;