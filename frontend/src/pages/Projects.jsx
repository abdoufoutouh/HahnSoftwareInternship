/**
 * Projects Dashboard Page
 * Main dashboard view showing projects and statistics
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import DashboardLayout from '../component/dashboards/DashboardLayout';
import StatsCards from '../component/dashboards/StatsCards';
import ProjectCardWithActions from '../component/dashboards/ProjectCardWithActions';
import Modal from '../component/common/Modal';
import { projectApi } from '../api/projectApi';

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
    // TODO: Navigate to project details
    console.log('Project clicked:', projectId);
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
    } catch (err) {
      console.error('Failed to delete project:', err);
      const errorMessage = err.response?.data?.message || 'Failed to delete project. Please try again.';
      setError(errorMessage);
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
