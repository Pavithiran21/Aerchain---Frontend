import React from 'react';
import TaskCard from './TaskCard';
import './TaskColumn.css';

const TaskColumn = ({ title, color, tasks, onTaskUpdate, onTaskDelete }) => {
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find(t => t._id === taskId) || 
                 document.querySelector(`[data-task-id="${taskId}"]`)?.taskData;
    
    if (task && task.status !== title) {
      onTaskUpdate(taskId, { status: title });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  return (
    <div 
      className={`task-column ${isDragOver ? 'drag-over' : ''}`}
      data-status={title}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      <div className="column-header">
        <h3>{title}</h3>
        <span className="task-count">{tasks.length}</span>
      </div>
      
      <div className="column-content">
        {tasks.map(task => (
          <TaskCard
            key={task._id}
            task={task}
            onUpdate={onTaskUpdate}
            onDelete={onTaskDelete}
          />
        ))}
        
        {tasks.length === 0 && (
          <div className="empty-column">
            <p>No tasks</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;