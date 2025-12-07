import React from 'react';
import TaskCard from './TaskCard';
import './TaskList.css';

const TaskList = ({ tasks, onTaskUpdate, onTaskDelete }) => {
  return (
    <div className="task-list">
      <div className="list-header">
        <div className="list-col">Title</div>
        <div className="list-col">Status</div>
        <div className="list-col">Priority</div>
        <div className="list-col">Due Date</div>
        <div className="list-col">Actions</div>
      </div>
      <div className="list-content">
        {tasks.length === 0 ? (
          <div className="empty-list">
            <p>No tasks found</p>
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task._id}
              task={task}
              onUpdate={onTaskUpdate}
              onDelete={onTaskDelete}
              viewMode="list"
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;
