import React from 'react';
import TaskColumn from './TaskColumn';
import { Mic } from 'lucide-react';
import './TaskBoard.css';

const TaskBoard = ({ tasks, onTaskUpdate, onTaskDelete, onVoiceInputOpen }) => {
  const columns = [
    { id: 'To Do', title: 'To Do', color: '#ef4444' },
    { id: 'In Progress', title: 'In Progress', color: '#f59e0b' },
    { id: 'Done', title: 'Done', color: '#10b981' }
  ];

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="task-board">
      <div className="board-header">
        <h2>Task Board</h2>
        <button 
          className="voice-btn"
          onClick={onVoiceInputOpen}
          title="Add task with voice"
        >
          <Mic size={20} />
          Voice Input
        </button>
      </div>
      
      <div className="board-columns">
        {columns.map(column => (
          <TaskColumn
            key={column.id}
            title={column.title}
            color={column.color}
            tasks={getTasksByStatus(column.id)}
            onTaskUpdate={onTaskUpdate}
            onTaskDelete={onTaskDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;