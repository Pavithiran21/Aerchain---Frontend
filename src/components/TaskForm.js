import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import API_URL from '../config';
import './TaskForm.css';

const TaskForm = ({ task, onClose, onTaskCreated }) => {
  // Convert DD-MM-YYYY to YYYY-MM-DD for date input
  const convertToInputFormat = (dateStr) => {
    if (!dateStr) return '';
    const [day, month, year] = dateStr.split('-');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'To Do',
    priority: task?.priority || 'Medium',
    dueDate: task?.dueDate ? convertToInputFormat(task.dueDate) : ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate fields
    const newErrors = {};
    if (!formData.title.trim() || formData.title.trim().length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    }
    if (!formData.description.trim() || formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    if (!formData.priority) {
      newErrors.priority = 'Priority is required';
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    setLoading(true);

    try {
      const url = task ? `${API_URL}/api/tasks/update-task` : `${API_URL}/api/tasks/create-task`;
      const method = task ? 'PUT' : 'POST';
      
      // Convert date to DD-MM-YYYY format for backend
      let formattedDate = null;
      if (formData.dueDate) {
        const date = new Date(formData.dueDate);
        formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
      }
      
      const payload = {
        ...formData,
        dueDate: formattedDate,
        transcript: (formData.description || formData.title).substring(0, 1000)
      };
      
      if (task) {
        payload._id = task._id;
      }
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success(task ? 'Task updated successfully!' : 'Task created successfully!');
        onTaskCreated();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to save task');
      }
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error('Failed to save task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{task ? 'Edit Task' : 'Create New Task'}</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">
              Title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className={`form-control ${errors.title ? 'error' : ''}`}
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">
              Description <span className="required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              className={`form-control ${errors.description ? 'error' : ''}`}
              rows="3"
              value={formData.description}
              onChange={handleChange}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">
                Status <span className="required">*</span>
              </label>
              {task ? (
                <select
                  id="status"
                  name="status"
                  className="form-control"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              ) : (
                <input
                  type="text"
                  className="form-control"
                  value="To Do"
                  disabled
                  style={{ cursor: 'not-allowed', opacity: 0.7 }}
                />
              )}
            </div>

            <div className="form-group">
              <label htmlFor="priority">
                Priority <span className="required">*</span>
              </label>
              <select
                id="priority"
                name="priority"
                className={`form-control ${errors.priority ? 'error' : ''}`}
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
              {errors.priority && <span className="error-message">{errors.priority}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">
              Due Date <span className="required">*</span>
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              className={`form-control ${errors.dueDate ? 'error' : ''}`}
              value={formData.dueDate}
              onChange={handleChange}
            />
            {errors.dueDate && <span className="error-message">{errors.dueDate}</span>}
          </div>

          {task?.transcript && (
            <div className="form-group">
              <label htmlFor="transcript">Voice Transcript</label>
              <textarea
                id="transcript"
                className="form-control"
                rows="3"
                value={task.transcript}
                disabled
                style={{ cursor: 'not-allowed', opacity: 0.7 }}
              />
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;