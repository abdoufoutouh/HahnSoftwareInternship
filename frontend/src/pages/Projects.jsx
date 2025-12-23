/**
 * Projects Dashboard Page
 * Main dashboard view showing projects and statistics
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import DashboardLayout from '../component/dashboards/DashboardLayout';
import StatsCards from '../component/dashboards/StatsCards';
import ProjectCardWithActions from '../component/dashboards/ProjectCardWithActions';
import ProjectDetailsModal from '../component/dashboards/ProjectDetailsModal';
import Modal from '../component/common/Modal';
import Toast from '../component/common/Toast';
import { projectApi } from '../api/projectApi';
import { taskApi } from '../api/taskApi';

function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  
  // Task creation modal state
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskLoading, setTaskLoading] = useState(false);
  const [taskError, setTaskError] = useState('');
  
  // Toast notification state
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  
  // Project details modal state
  const [isProjectDetailsOpen, setIsProjectDetailsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  /**
   * Transform API project response to UI format
   * API returns: { id, title, description, tasks: [] }
   * UI expects: { id, title, description, totalTasks, completedTasks, progress, lastUpdated }
   */
  const transformProject = (apiProject, progressData = null) => {
    if (!apiProject || !apiProject.id) {
      return null;
    }

    // Use backend progress if available, otherwise calculate from tasks
    let totalTasks = 0;
    let completedTasks = 0;
    let progress = 0;

    if (progressData) {
      // Use backend-calculated progress
      // Backend returns: { projectId, totalTasks, completedTasks, progressPercentage }
      totalTasks = progressData.totalTasks || 0;
      completedTasks = progressData.completedTasks || 0;
      // Backend field is "progressPercentage", not "progress"
      const progressValue = progressData.progressPercentage !== undefined 
        ? progressData.progressPercentage 
        : (progressData.progress !== undefined ? progressData.progress : 0);
      // Ensure progress is a number between 0 and 100
      progress = typeof progressValue === 'number' 
        ? Math.max(0, Math.min(100, progressValue)) 
        : 0;
    } else {
      // Fallback: calculate from tasks array
      const tasks = Array.isArray(apiProject.tasks) ? apiProject.tasks : [];
      totalTasks = tasks.length;
      completedTasks = tasks.filter(task => task.completed === true).length;
      progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    }

    return {
      id: apiProject.id,
      title: apiProject.title || '',
      description: apiProject.description || '',
      totalTasks,
      completedTasks,
      progress,
      lastUpdated: new Date().toISOString().slice(0, 10)
    };
  };

  /**
   * Fetch projects from API on component mount
   */
  useEffect(() => {
    const loadProjects = async () => {
      setIsLoadingProjects(true);
      setError('');

      try {
        // Fetch projects list
        const apiProjects = await projectApi.getMyProjects();
        
        if (!Array.isArray(apiProjects)) {
          console.error('Invalid API response:', apiProjects);
          setProjects([]);
          return;
        }

        // Fetch progress for each project in parallel
        const progressPromises = apiProjects.map(async (project) => {
          try {
            const progressData = await projectApi.getProjectProgress(project.id);
            console.log(`Progress data for project ${project.id}:`, progressData);
            return { projectId: project.id, progressData };
          } catch (err) {
            // If progress fetch fails, use null (will fallback to task-based calculation)
            console.warn(`Failed to fetch progress for project ${project.id}:`, err);
            return { projectId: project.id, progressData: null };
          }
        });

        const progressResults = await Promise.all(progressPromises);
        
        // Create a map of projectId -> progressData for quick lookup
        const progressMap = new Map();
        progressResults.forEach(({ projectId, progressData }) => {
          progressMap.set(projectId, progressData);
        });

        // Transform projects with their progress data
        const transformedProjects = apiProjects
          .map(apiProject => {
            const progressData = progressMap.get(apiProject.id);
            const transformed = transformProject(apiProject, progressData);
            // Debug: log progress values
            if (transformed) {
              console.log(`Project ${transformed.id} (${transformed.title}): progress = ${transformed.progress}%`);
            }
            return transformed;
          })
          .filter(project => project !== null);

        setProjects(transformedProjects);
      } catch (err) {
        console.error('Error loading projects:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load projects';
        setError(errorMessage);
        setProjects([]);
      } finally {
        setIsLoadingProjects(false);
      }
    };

    loadProjects();
  }, []);

  // Calculate statistics
  const totalProjects = projects.length;
  const totalTasks = projects.reduce((sum, project) => sum + project.totalTasks, 0);
  const completedTasks = projects.reduce((sum, project) => sum + project.completedTasks, 0);
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filter projects based on search term
  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCreateProject = () => {
    setError('');
    setTitle('');
    setDescription('');
    setIsCreateOpen(true);
  };

  const submitCreateProject = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Project title is required.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const created = await projectApi.createProject({ 
        title: title.trim(), 
        description: description.trim() || undefined 
      });
      
      // Fetch progress for the newly created project
      let progressData = null;
      try {
        progressData = await projectApi.getProjectProgress(created.id);
      } catch (progressErr) {
        // If progress fetch fails, use null (will fallback to task-based calculation)
        console.warn(`Failed to fetch progress for new project ${created.id}:`, progressErr);
      }
      
      setIsCreateOpen(false);
      setLoading(false);
      
      // Transform and add the newly created project with progress
      const transformedProject = transformProject(created, progressData);
      if (transformedProject) {
        setProjects((prev) => [transformedProject, ...prev]);
      }
    } catch (err) {
      setLoading(false);
      const message = err?.response?.data?.message || 'Failed to create project. Please try again.';
      setError(message);
    }
  };

  const handleProjectClick = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setSelectedProject(project);
      setIsProjectDetailsOpen(true);
    }
  };

  const handleCloseProjectDetails = () => {
    setIsProjectDetailsOpen(false);
    setSelectedProject(null);
    // Refresh projects to get updated progress
    const refreshProjects = async () => {
      try {
        const apiProjects = await projectApi.getMyProjects();
        if (Array.isArray(apiProjects)) {
          const progressPromises = apiProjects.map(async (project) => {
            try {
              const progressData = await projectApi.getProjectProgress(project.id);
              return { projectId: project.id, progressData };
            } catch (err) {
              return { projectId: project.id, progressData: null };
            }
          });
          const progressResults = await Promise.all(progressPromises);
          const progressMap = new Map();
          progressResults.forEach(({ projectId, progressData }) => {
            progressMap.set(projectId, progressData);
          });
          const transformedProjects = apiProjects
            .map(apiProject => {
              const progressData = progressMap.get(apiProject.id);
              return transformProject(apiProject, progressData);
            })
            .filter(project => project !== null);
          setProjects(transformedProjects);
        }
      } catch (err) {
        console.error('Failed to refresh projects:', err);
      }
    };
    refreshProjects();
  };

  const handleDeleteProject = async (projectId) => {
    // Show confirmation dialog
    const confirmed = window.confirm('Are you sure you want to delete this project?');
    
    if (!confirmed) {
      return; // User cancelled, do nothing
    }

    try {
      // Call API to delete project
      await projectApi.deleteProject(projectId);
      
      // Remove project from UI state after successful deletion
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      
      // Show success toast
      setToastMessage('Projet supprimé avec succès !');
      setToastVisible(true);
    } catch (err) {
      console.error('Failed to delete project:', err);
      const errorMessage = err.response?.data?.message || 'Failed to delete project. Please try again.';
      setError(errorMessage);
    }
  };

  const handleAddTasks = (projectId) => {
    setSelectedProjectId(projectId);
    setTaskTitle('');
    setTaskDescription('');
    setTaskDueDate('');
    setTaskError('');
    setIsAddTaskOpen(true);
  };

  const submitCreateTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      setTaskError('Task title is required.');
      return;
    }
    if (!taskDueDate) {
      setTaskError('Due date is required.');
      return;
    }

    try {
      setTaskLoading(true);
      setTaskError('');
      
      // Create task
      await taskApi.createTask(selectedProjectId, {
        title: taskTitle.trim(),
        description: taskDescription.trim() || undefined,
        dueDate: taskDueDate
      });

      // Close modal
      setIsAddTaskOpen(false);
      setTaskLoading(false);

      // Show success toast
      setToastMessage('Task ajoutée avec succès !');
      setToastVisible(true);

      // Refresh project progress for the updated project
      try {
        const progressData = await projectApi.getProjectProgress(selectedProjectId);
        setProjects((prev) => 
          prev.map(project => {
            if (project.id === selectedProjectId) {
              return {
                ...project,
                totalTasks: progressData.totalTasks || project.totalTasks,
                completedTasks: progressData.completedTasks || project.completedTasks,
                progress: progressData.progressPercentage || project.progress
              };
            }
            return project;
          })
        );
      } catch (progressErr) {
        console.warn('Failed to refresh project progress:', progressErr);
        // Don't show error to user, progress will update on next page load
      }
    } catch (err) {
      setTaskLoading(false);
      const message = err?.response?.data?.message || 'Failed to create task. Please try again.';
      setTaskError(message);
    }
  };

  return (
    <DashboardLayout pageTitle="My Projects">
      <Modal isOpen={isCreateOpen} title="Create New Project" onClose={() => !loading && setIsCreateOpen(false)}>
        <form onSubmit={submitCreateProject}>
          <div className="form-group">
            <label className="form-label" htmlFor="project-title">Project Title</label>
            <input id="project-title" className="input" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter project title" required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="project-desc">Project Description</label>
            <textarea id="project-desc" className="textarea" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" />
          </div>
          {error && <div className="error-text" role="alert">{error}</div>}
          <div className="actions">
            <button type="button" className="btn btn-ghost" onClick={() => setIsCreateOpen(false)} disabled={loading}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Task Modal */}
      <Modal isOpen={isAddTaskOpen} title="Add Task" onClose={() => !taskLoading && setIsAddTaskOpen(false)}>
        <form onSubmit={submitCreateTask}>
          <div className="form-group">
            <label className="form-label" htmlFor="task-title">Task Title</label>
            <input 
              id="task-title" 
              className="input" 
              type="text" 
              value={taskTitle} 
              onChange={(e) => setTaskTitle(e.target.value)} 
              placeholder="Enter task title" 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="task-desc">Task Description</label>
            <textarea 
              id="task-desc" 
              className="textarea" 
              value={taskDescription} 
              onChange={(e) => setTaskDescription(e.target.value)} 
              placeholder="Optional description" 
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="task-due-date">Due Date</label>
            <input 
              id="task-due-date" 
              className="input" 
              type="date" 
              value={taskDueDate} 
              onChange={(e) => setTaskDueDate(e.target.value)} 
              required 
            />
          </div>
          {taskError && <div className="error-text" role="alert">{taskError}</div>}
          <div className="actions">
            <button 
              type="button" 
              className="btn btn-ghost" 
              onClick={() => setIsAddTaskOpen(false)} 
              disabled={taskLoading}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={taskLoading}>
              {taskLoading ? <span className="spinner" /> : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Project Details Modal */}
      <ProjectDetailsModal
        isOpen={isProjectDetailsOpen}
        project={selectedProject}
        onClose={handleCloseProjectDetails}
      />

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type="success"
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
        duration={4000}
      />

      {/* Error message display */}
      {error && !isCreateOpen && (
        <div className="error-text" style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: 'var(--error-bg, #fee)', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <StatsCards 
        totalProjects={totalProjects}
        totalTasks={totalTasks}
        completedTasks={completedTasks}
        overallProgress={overallProgress}
      />

      {/* Projects Section */}
      <section className="dashboard-section">
        <div className="projects-header">
          <h2 style={{ margin: 0 }}>Projects</h2>
          <div className="controls">
            <button className="create-btn" onClick={handleCreateProject}>Create Project</button>
            <label aria-label="Search projects" style={{ display: 'contents' }}>
              <input
                type="text"
                className="search-input"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="projects-grid">
          {isLoadingProjects ? (
            <div style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' }}>
              Loading projects...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' }}>
              {searchTerm ? 'No projects match your search.' : 'No projects found. Create your first project!'}
            </div>
          ) : (
            filteredProjects.map((p) => (
              <ProjectCardWithActions
                key={p.id}
                project={p}
                onProjectClick={handleProjectClick}
                onAddTasks={handleAddTasks}
                onDeleteProject={handleDeleteProject}
              />
            ))
          )}
        </div>
      </section>
    </DashboardLayout>
  );
}

export default Projects;
