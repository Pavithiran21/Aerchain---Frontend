import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import API_URL from '../config';
import './TaskViewModal.css';

const TaskViewModal = ({ task, onClose, onUpdate }) => {
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (status === task.status && priority === task.priority) {
      onClose();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/tasks/update-task`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: task._id, status, priority })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update task');
      }

      toast.success('Task updated successfully!');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error(error.message || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const [day, month, year] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="modal-overlay">
      <div className="modal task-view-modal">
        <div className="modal-header">
          <h3>Task Details</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="task-view-content">
          <div className="view-field">
            <label>Title</label>
            <p className="field-value">{task.title}</p>
          </div>

          <div className="view-field">
            <label>Description</label>
            <p className="field-value">{task.description || 'No description'}</p>
          </div>

          <div className="view-field-row">
            <div className="view-field">
              <label>Status</label>
              <select
                className="form-control"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div className="view-field">
              <label>Priority</label>
              <select
                className="form-control"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="view-field">
            <label><Calendar size={16} /> Due Date</label>
            <p className="field-value">{formatDate(task.dueDate)}</p>
          </div>

          {task.transcript && (
            <div className="view-field">
              <label>Voice Transcript</label>
              <p className="field-value transcript-text">"{task.transcript}"</p>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskViewModal;
