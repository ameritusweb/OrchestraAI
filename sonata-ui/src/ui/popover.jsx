import React, { useState, useEffect, useRef, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { Popover as BSPopover } from 'bootstrap';

export const Popover = ({ children, open }) => {
  const [isOpen, setIsOpen] = useState(open);
  const triggerRef = useRef(null);
  const contentRef = useRef(null);
  const popoverRef = useRef(null);

  useEffect(() => {
    if (triggerRef.current && contentRef.current) {
      popoverRef.current = new BSPopover(triggerRef.current, {
        content: contentRef.current,
        html: true,
        trigger: 'manual',
        placement: 'auto',
      });
    }
    return () => {
      if (popoverRef.current) {
        popoverRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (popoverRef.current) {
      if (isOpen) {
        popoverRef.current.show();
      } else {
        popoverRef.current.hide();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { triggerRef, contentRef });
        }
        return child;
      })}
    </>
  );
};

Popover.propTypes = {
  children: PropTypes.node.isRequired,
  open: PropTypes.bool,
};

export const PopoverTrigger = ({ children, triggerRef }) => {
  return React.cloneElement(children, { ref: triggerRef });
};

PopoverTrigger.propTypes = {
  children: PropTypes.element.isRequired,
  triggerRef: PropTypes.oneOfType([
    PropTypes.func, 
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
};

export const PopoverContent = ({ children, contentRef }) => {
  return <div ref={contentRef}>{children}</div>;
};

PopoverContent.propTypes = {
  children: PropTypes.node.isRequired,
  contentRef: PropTypes.oneOfType([
    PropTypes.func, 
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
};
