import React, { useState, useEffect, useCallback, useRef } from 'react';
import TaskBoard from './components/TaskBoard';
import TaskList from './components/TaskList';
import VoiceInput from './components/VoiceInput';
import TaskForm from './components/TaskForm';
import FilterBar from './components/FilterBar';
import Notification from './components/Notification';
import ThemeToggle from './components/ThemeToggle';
import Pagination from './components/Pagination';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_URL from './config';

import { Plus, LayoutGrid, List } from 'lucide-react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [filters, setFilters] = useState({ status: '', priority: '', search: '', dueDate: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [viewMode, setViewMode] = useState('board');
  const hasShownInitialToast = useRef(false);


  const fetchTasks = useCallback(async (searchFilters = null, page = 1, showToast = false) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', '5');
      
      // Add filters if provided
      if (searchFilters) {
        if (searchFilters.status) params.append('status', searchFilters.status);
        if (searchFilters.priority) params.append('priority', searchFilters.priority);
        if (searchFilters.search) params.append('search', searchFilters.search);
        if (searchFilters.dueDate) params.append('dueDate', searchFilters.dueDate);
      }
      
      const endpoint = viewMode === 'board' ? '/api/tasks/board' : '/api/tasks';
      const response = await fetch(`${API_URL}${endpoint}?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const result = await response.json();
      setTasks(result.data || []);
      setPagination(result.pagination);
      setCurrentPage(page);
      if (showToast) {
        toast.success('Tasks retrieved successfully', { toastId: 'fetch-tasks' });
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks. Please try again.');
      toast.error('Failed to retrieve tasks');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode]);

  useEffect(() => {
    fetchTasks(null, 1, true);
  }, [fetchTasks]);

  // Debounced search effect
  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }
    
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchTasks(filters, 1);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [filters, fetchTasks, isInitialLoad]);

  // Refetch when view mode changes
  useEffect(() => {
    if (!isInitialLoad) {
      setCurrentPage(1);
      fetchTasks(filters, 1);
    }
  }, [viewMode, filters, fetchTasks, isInitialLoad]);

  const handleTaskCreated = () => {
    setShowTaskForm(false);
    setShowVoiceInput(false);
    fetchTasks(filters, currentPage);
  };

  const handlePageChange = (page) => {
    fetchTasks(filters, page, true);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      const response = await fetch(`${API_URL}/api/tasks/update-task`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: taskId, ...updates })
      });
      if (!response.ok) throw new Error('Failed to update task');
      await fetchTasks(filters, currentPage);
      toast.success('Task updated successfully!');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      const response = await fetch(`${API_URL}/api/tasks/delete-task?id=${taskId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete task');
      await fetchTasks(filters, currentPage);
      toast.success('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  // Remove client-side filtering since we're using backend search
  const filteredTasks = tasks;

  return (
    <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
      <header className="app-header">
        <h1>Voice Task Tracker</h1>
        <div className="header-actions">
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'board' ? 'active' : ''}`}
              onClick={() => setViewMode('board')}
              title="Board View"
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <List size={18} />
            </button>
          </div>
          <ThemeToggle 
            isDark={isDarkMode} 
            onToggle={() => setIsDarkMode(!isDarkMode)} 
          />
          <button 
            className="btn btn-primary"
            onClick={() => setShowTaskForm(true)}
          >
            <Plus size={20} />
            Add Task
          </button>
        </div>
      </header>

      <FilterBar filters={filters} onFiltersChange={setFilters} />

      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button className="btn btn-secondary" onClick={() => fetchTasks()}>
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading tasks...</p>
        </div>
      ) : (
        <>
          {viewMode === 'board' ? (
            <TaskBoard 
              tasks={filteredTasks}
              onTaskUpdate={handleTaskUpdate}
              onTaskDelete={handleTaskDelete}
              onVoiceInputOpen={() => setShowVoiceInput(true)}
            />
          ) : (
            <TaskList 
              tasks={filteredTasks}
              onTaskUpdate={handleTaskUpdate}
              onTaskDelete={handleTaskDelete}
            />
          )}
          {pagination && (pagination.hasNext || pagination.hasPrev) && (
            <Pagination 
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {showTaskForm && (
        <TaskForm 
          onClose={() => setShowTaskForm(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}

      {showVoiceInput && (
        <VoiceInput 
          onClose={() => setShowVoiceInput(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </div>
  );
}

export default App;