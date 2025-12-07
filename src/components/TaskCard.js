import React, { useState } from 'react';
import { Calendar, Flag, Trash2, Edit } from 'lucide-react';
import TaskForm from './TaskForm';
import TaskViewModal from './TaskViewModal';
import ConfirmDialog from './ConfirmDialog';
import './TaskCard.css';

const TaskCard = ({ task, onUpdate, onDelete, viewMode = 'board' }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('taskId', task._id);
    e.target.taskData = task;
  };



  const formatDate = (dateString) => {
    if (!dateString || dateString === 'Invalid Date') return 'Invalid Date';
    return dateString;
  };

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setShowConfirm(false);
    await onDelete(task._id);
  };

  const handleCardClick = (e) => {
    // Don't open modal if clicking on action buttons
    if (e.target.closest('.action-btn')) return;
    setShowViewModal(true);
  };

  if (viewMode === 'list') {
    return (
      <>
        <div 
          className="task-card list-mode"
          onClick={handleCardClick}
          data-task-id={task._id}
        >
          <h4 className="task-title">{task.title}</h4>
          <div className={`status-badge ${task.status.toLowerCase().replace(' ', '-')}`}>
            {task.status}
          </div>
          <div className={`priority-badge ${task.priority.toLowerCase()}`}>
            <Flag size={12} />
            {task.priority}
          </div>
          <div className="due-date">
            <Calendar size={12} />
            {formatDate(task.dueDate)}
          </div>
          <div className="task-actions">
            <button 
              className="action-btn"
              onClick={(e) => { e.stopPropagation(); setShowEditForm(true); }}
              title="Edit task"
            >
              <Edit size={14} />
            </button>
            <button 
              className="action-btn delete-btn"
              onClick={(e) => { e.stopPropagation(); handleDeleteClick(); }}
              title="Delete task"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {showViewModal && (
          <TaskViewModal
            task={task}
            onClose={() => setShowViewModal(false)}
            onUpdate={() => {
              setShowViewModal(false);
              onUpdate(task._id, {});
            }}
          />
        )}

        {showEditForm && (
          <TaskForm 
            task={task}
            onClose={() => setShowEditForm(false)}
            onTaskCreated={() => {
              setShowEditForm(false);
              onUpdate(task._id, {});
            }}
          />
        )}

        {showConfirm && (
          <ConfirmDialog
            message="Are you sure you want to delete this task?"
            onConfirm={handleDeleteConfirm}
            onCancel={() => setShowConfirm(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div 
        className="task-card"
        data-priority={task.priority}
        draggable
        onDragStart={handleDragStart}
        onClick={handleCardClick}
        data-task-id={task._id}
      >
        <div className="task-header">
          <div className="task-actions">
            <button 
              className="action-btn"
              onClick={() => setShowEditForm(true)}
              title="Edit task"
            >
              <Edit size={14} />
            </button>
            <button 
              className="action-btn delete-btn"
              onClick={handleDeleteClick}
              title="Delete task"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <h4 className="task-title">{task.title}</h4>
        
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        <div className="task-meta">
          <div 
            className={`priority-badge ${task.priority.toLowerCase()}`}
          >
            <Flag size={12} />
            {task.priority}
          </div>

          {task.dueDate && (
            <div className="due-date">
              <Calendar size={12} />
              {formatDate(task.dueDate)}
            </div>
          )}
        </div>

        {task.transcript && (
          <div className="transcript">
            <small>Voice: "{task.transcript}"</small>
          </div>
        )}
      </div>

      {showViewModal && (
        <TaskViewModal
          task={task}
          onClose={() => setShowViewModal(false)}
          onUpdate={() => {
            setShowViewModal(false);
            onUpdate(task._id, {});
          }}
        />
      )}

      {showEditForm && (
        <TaskForm 
          task={task}
          onClose={() => setShowEditForm(false)}
          onTaskCreated={() => {
            setShowEditForm(false);
            // Trigger a refresh by calling onUpdate with current data
            onUpdate(task._id, {});
          }}
        />
      )}

      {showConfirm && (
        <ConfirmDialog
          message="Are you sure you want to delete this task?"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
};

export default TaskCard;