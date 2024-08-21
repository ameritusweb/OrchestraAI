import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'bootstrap';

export const AlertDialog = ({ open, onOpenChange, children }) => {
    const modalRef = useRef(null);
  
    useEffect(() => {
      const modalElement = modalRef.current;
      const modalInstance = new Modal(modalElement, {
        backdrop: 'static',
        keyboard: false
      });
  
      if (open) {
        modalInstance.show();
      } else {
        modalInstance.hide();
      }
  
      modalElement.addEventListener('hidden.bs.modal', () => onOpenChange(false));
  
      return () => {
        modalInstance.dispose();
      };
    }, [open, onOpenChange]);
  
    return (
      <div className="modal fade" tabIndex={-1} ref={modalRef}>
        <div className="modal-dialog">
          {children}
        </div>
      </div>
    );
  };
  
  AlertDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onOpenChange: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
  };

  export const Dialog = ({ open, onOpenChange, children }) => {
    const modalRef = useRef(null);
  
    useEffect(() => {
      const modalElement = modalRef.current;
      const modalInstance = new Modal(modalElement, {
        backdrop: 'static',
        keyboard: false
      });
  
      if (open) {
        modalInstance.show();
      } else {
        modalInstance.hide();
      }
  
      modalElement.addEventListener('hidden.bs.modal', () => onOpenChange(false));
  
      return () => {
        modalInstance.dispose();
      };
    }, [open, onOpenChange]);
  
    return (
      <div className="modal fade" tabIndex={-1} ref={modalRef}>
        <div className="modal-dialog">
          {children}
        </div>
      </div>
    );
  };
  
  Dialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onOpenChange: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
  };

// Shared content components
export const DialogContent = ({ children, className }) => (
  <div className={`modal-content ${className}`}>
    {children}
  </div>
);
DialogContent.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export const AlertDialogContent = ({ children }) => (
  <div className="modal-content">
    {children}
  </div>
);
AlertDialogContent.propTypes = {
  children: PropTypes.node.isRequired,
};

export const DialogHeader = ({ children }) => (
  <div className="modal-header">
    {children}
  </div>
);
DialogHeader.propTypes = {
  children: PropTypes.node.isRequired,
};

export const AlertDialogHeader = ({ children }) => (
  <div className="modal-header">
    {children}
  </div>
);
AlertDialogHeader.propTypes = {
  children: PropTypes.node.isRequired,
};

export const DialogTitle = ({ children }) => (
  <h5 className="modal-title">{children}</h5>
);
DialogTitle.propTypes = {
  children: PropTypes.node.isRequired,
};

export const AlertDialogTitle = ({ children }) => (
  <h5 className="modal-title">{children}</h5>
);
AlertDialogTitle.propTypes = {
  children: PropTypes.node.isRequired,
};

export const DialogDescription = ({ children }) => (
  <p>{children}</p>
);
DialogDescription.propTypes = {
  children: PropTypes.node.isRequired,
};

export const AlertDialogDescription = ({ children }) => (
  <p>{children}</p>
);
AlertDialogDescription.propTypes = {
  children: PropTypes.node.isRequired,
};

export const DialogFooter = ({ children }) => (
  <div className="modal-footer">
    {children}
  </div>
);
DialogFooter.propTypes = {
  children: PropTypes.node.isRequired,
};

export const AlertDialogFooter = ({ children }) => (
  <div className="modal-footer">
    {children}
  </div>
);
AlertDialogFooter.propTypes = {
  children: PropTypes.node.isRequired,
};

// Specific button components for AlertDialog
export const AlertDialogCancel = ({ children, ...props }) => (
  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" {...props}>
    {children}
  </button>
);
AlertDialogCancel.propTypes = {
  children: PropTypes.node.isRequired,
};

export const AlertDialogAction = ({ children, ...props }) => (
  <button type="button" className="btn btn-primary" {...props}>
    {children}
  </button>
);
AlertDialogAction.propTypes = {
  children: PropTypes.node.isRequired,
};
