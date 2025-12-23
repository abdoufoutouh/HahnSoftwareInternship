import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import ProgressBar from './ProgressBar';
import { taskApi } from '../../api/taskApi';
import { projectApi } from '../../api/projectApi';

const ProjectDetailsModal = ({ isOpen, project, onClose }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [originalTasks, setOriginalTasks] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Load tasks when modal opens
  useEffect(() => {
    if (isOpen && project?.id) {
      loadTasks();
    }
  }, [isOpen, project?.id]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTasks([]);
      setOriginalTasks([]);
      setEditingTaskId(null);
      setHasChanges(false);
      setError('');
    }
  }, [isOpen]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const fetchedTasks = await taskApi.getTasksByProject(project.id);
      console.log('Fetched tasks from API:', fetchedTasks);
      console.log('Is array?', Array.isArray(fetchedTasks));
      // Ensure tasks is always an array
      const tasksArray = Array.isArray(fetchedTasks) ? fetchedTasks : [];
      console.log('Tasks array after processing:', tasksArray);
      console.log('Tasks length:', tasksArray.length);
      setTasks(tasksArray);
      setOriginalTasks(JSON.parse(JSON.stringify(tasksArray))); // Deep copy
      setHasChanges(false);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      console.error('Error details:', err.response?.data);
      setError('Failed to load tasks. Please try again.');
      setTasks([]); // Set empty array on error
      setOriginalTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const loadProjectProgress = async () => {
    try {
      const progressData = await projectApi.getProjectProgress(project.id);
      return progressData;
    } catch (err) {
      console.warn('Failed to refresh project progress:', err);
      return null;
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      setError('');
      const updatedTask = await taskApi.toggleTask(taskId);
      console.log('Task toggled successfully:', updatedTask);
      
      // Update task in state
      setTasks(prev => {
        if (!Array.isArray(prev)) return [];
        return prev.map(t => {
          if (t.id === taskId) {
            return updatedTask;
          }
          return t;
        });
      });
      setHasChanges(true);
      
      // Refresh project progress
      await loadProjectProgress();
    } catch (err) {
      console.error('Failed to toggle task:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update task. Please try again.';
      setError(errorMessage);
    }
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    // Format date for input (YYYY-MM-DD)
    const dueDate = task.dueDate ? (typeof task.dueDate === 'string' ? task.dueDate.split('T')[0] : task.dueDate) : '';
    setEditDueDate(dueDate);
  };

  const handleSaveEdit = async (taskId) => {
    if (!editTitle.trim()) {
      setError('Task title is required.');
      return;
    }
    if (!editDueDate) {
      setError('Due date is required.');
      return;
    }

    try {
      const updatedTask = await taskApi.updateTask(taskId, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
        dueDate: editDueDate
      });
      
      setTasks(prev => Array.isArray(prev) ? prev.map(t => t.id === taskId ? updatedTask : t) : []);
      setEditingTaskId(null);
      setHasChanges(true);
      setError('');
      
      // Refresh project progress
      await loadProjectProgress();
    } catch (err) {
      console.error('Failed to update task:', err);
      setError('Failed to update task. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditTitle('');
    setEditDescription('');
    setEditDueDate('');
    setError('');
  };

  const handleDeleteTask = async (taskId) => {
    const confirmed = window.confirm('Are you sure you want to delete this task?');
    if (!confirmed) return;

    try {
      await taskApi.deleteTask(taskId);
      setTasks(prev => Array.isArray(prev) ? prev.filter(t => t.id !== taskId) : []);
      setHasChanges(true);
      
      // Refresh project progress
      await loadProjectProgress();
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError('Failed to delete task. Please try again.');
    }
  };

  const handleSaveAll = async () => {
    // All changes are already saved individually, just refresh
    await loadTasks();
    setHasChanges(false);
  };

  const handleCancelAll = () => {
    // Revert to original state
    setTasks(JSON.parse(JSON.stringify(originalTasks)));
    setEditingTaskId(null);
    setHasChanges(false);
    setError('');
  };

  // Render task title with strikethrough style for completed tasks
  const renderTaskTitle = (task) => {
    if (!task || !task.title) return '';
    if (task.completed) {
      // Render each character separated by -
      return task.title.split('').join('-');
    }
    return task.title;
  };

  if (!project) {
    console.warn('ProjectDetailsModal: No project provided');
    return null;
  }

  console.log('ProjectDetailsModal render - isOpen:', isOpen, 'project:', project, 'tasks:', tasks, 'tasks length:', tasks?.length);

  return (
    <Modal isOpen={isOpen} title="" onClose={onClose}>
      <div style={{ padding: '20px' }}>
        {/* Project Title - Centered */}
        <h2 style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>
          {project.title}
        </h2>

        {/* Progress Bar */}
        <div style={{ marginBottom: '24px' }}>
          <ProgressBar percent={project.progress || 0} ariaLabel={`${project.title} progress`} />
        </div>

        {/* Project Description */}
        {project.description && (
          <div style={{ marginBottom: '24px', color: 'var(--text-muted)', textAlign: 'center' }}>
            {project.description}
          </div>
        )}

        {/* Global Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-primary"
            onClick={handleSaveAll}
            disabled={!hasChanges || loading}
          >
            Save All Changes
          </button>
          <button
            className="btn btn-ghost"
            onClick={handleCancelAll}
            disabled={!hasChanges || loading}
          >
            Cancel All Changes
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-text" style={{ marginBottom: '16px' }} role="alert">
            {error}
          </div>
        )}

        {/* Tasks List */}
        <div style={{ marginTop: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>Tasks</h3>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
              Loading tasks...
            </div>
          ) : !Array.isArray(tasks) ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--error, #f00)' }}>
              Error: Tasks data is not an array. Type: {typeof tasks}, Value: {JSON.stringify(tasks)}
            </div>
          ) : tasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
              No tasks yet. Add your first task!
            </div>
          ) : (
            <div style={{ listStyle: 'none', padding: 0 }}>
              {tasks.map((task) => {
                if (!task || !task.id) {
                  console.warn('Invalid task object:', task);
                  return null;
                }
                return (
                <div
                  key={task.id}
                  style={{
                    marginBottom: '12px',
                    padding: '12px',
                    backgroundColor: 'var(--panel-bg, #f5f5f5)',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  {/* Task Bullet Point */}
                  <span style={{ fontSize: '18px' }}>-</span>
                  
                  {/* Task Title */}
                  {editingTaskId === task.id ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <input
                        type="text"
                        className="input"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Task title"
                        style={{ width: '100%' }}
                      />
                      <textarea
                        className="textarea"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Description (optional)"
                        style={{ width: '100%', minHeight: '60px' }}
                      />
                      <input
                        type="date"
                        className="input"
                        value={editDueDate}
                        onChange={(e) => setEditDueDate(e.target.value)}
                        style={{ width: '100%' }}
                      />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleSaveEdit(task.id)}
                          style={{ fontSize: '12px', padding: '6px 12px' }}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-ghost"
                          onClick={handleCancelEdit}
                          style={{ fontSize: '12px', padding: '6px 12px' }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span
                        style={{
                          flex: 1,
                          textDecoration: task.completed ? 'line-through' : 'none',
                          fontFamily: task.completed ? 'monospace' : 'inherit',
                          letterSpacing: task.completed ? '2px' : 'normal',
                        }}
                      >
                        {renderTaskTitle(task)}
                      </span>
                      
                      {/* Task Actions */}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleToggleTask(task.id)}
                          title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                          style={{ fontSize: '12px', padding: '6px 12px' }}
                        >
                          {task.completed ? '↩️' : '✅'}
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleEditTask(task)}
                          title="Edit task"
                          style={{ fontSize: '12px', padding: '6px 12px' }}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteTask(task.id)}
                          title="Delete task"
                          style={{ fontSize: '12px', padding: '6px 12px' }}
                        >
                          🗑️
                        </button>
                      </div>
                    </>
                  )}
                </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ProjectDetailsModal;

