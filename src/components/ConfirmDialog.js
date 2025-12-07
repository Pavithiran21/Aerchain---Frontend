import React from 'react';
import { AlertTriangle } from 'lucide-react';
import './ConfirmDialog.css';

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="confirm-dialog">
        <div className="confirm-icon">
          <AlertTriangle size={48} />
        </div>
        <h3>Confirm Action</h3>
        <p>{message}</p>
        <div className="confirm-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
