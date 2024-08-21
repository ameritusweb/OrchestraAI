import React from 'react';
import PropTypes from 'prop-types';

export const ScrollArea = ({ className, children, ...props }) => {
  return (
    <div className={`scroll-area ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

ScrollArea.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

// CSS to be added to your project
const scrollAreaStyles = `
.scroll-area {
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #6c757d transparent;
}

.scroll-area::-webkit-scrollbar {
  width: 6px;
}

.scroll-area::-webkit-scrollbar-track {
  background: transparent;
}

.scroll-area::-webkit-scrollbar-thumb {
  background-color: #6c757d;
  border-radius: 3px;
}
`;