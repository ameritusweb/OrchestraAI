import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const useResizable = (defaultSize, minSize = 10, maxSize = 90) => {
  const [size, setSize] = useState(defaultSize);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startSize = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      const dx = e.clientX - startX.current;
      const newSize = Math.min(Math.max(startSize.current + dx / window.innerWidth * 100, minSize), maxSize);
      setSize(newSize);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [minSize, maxSize]);

  const startResize = (e) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startSize.current = size;
  };

  return [size, startResize];
};

export const ResizablePanel = ({ defaultSize, children }) => {
  const [size, startResize] = useResizable(defaultSize);

  return (
    <div className="d-flex flex-column h-100" style={{ width: `${size}%` }}>
      {children}
      <div
        className="resizer"
        style={{
          width: '10px',
          cursor: 'col-resize',
          backgroundColor: '#f0f0f0',
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
        }}
        onMouseDown={startResize}
      />
    </div>
  );
};

ResizablePanel.propTypes = {
  defaultSize: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
};

export const ResizablePanelGroup = ({ direction, children }) => {
  return (
    <div className={`d-flex ${direction === 'horizontal' ? 'flex-row' : 'flex-column'} h-100`}>
      {children}
    </div>
  );
};

ResizablePanelGroup.propTypes = {
  direction: PropTypes.oneOf(['horizontal', 'vertical']).isRequired,
  children: PropTypes.node.isRequired,
};