/**
 * Projects Dashboard Page
 * Main dashboard view showing projects and statistics
 */

import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import DashboardLayout from '../component/dashboards/DashboardLayout';
import StatsCards from '../component/dashboards/StatsCards';
import ProjectCardWithActions from '../component/dashboards/ProjectCardWithActions';
import Modal from '../component/common/Modal';
import { projectApi } from '../api/projectApi';

// Mock data for projects
const mockProjects = [
  {
    id: 1,
    title: 'E-commerce Platform',
    description: 'Build a full-featured online store with payment integration',
    totalTasks: 12,
    completedTasks: 8,
    progress: 67,
    lastUpdated: '2025-12-20'
  },
  {
    id: 2,
    title: 'Portfolio Website',
    description: 'Personal portfolio showcasing my work and skills',
    totalTasks: 5,
    completedTasks: 3,
    progress: 60,
    lastUpdated: '2025-12-18'
  },
  {
    id: 3,
    title: 'Task Management App',
    description: 'A Kanban-style task management application',
    totalTasks: 15,
    completedTasks: 5,
    progress: 33,
    lastUpdated: '2025-12-15'
  },
  {
    id: 4,
    title: 'API Integration',
    description: 'Integrate third-party APIs into existing system',
    totalTasks: 8,
    completedTasks: 2,
    progress: 25,
    lastUpdated: '2025-12-10'
  },
  {
    id: 5,
    title: 'Mobile App UI/UX',
    description: 'Design and implement mobile app interface',
    totalTasks: 20,
    completedTasks: 15,
    progress: 75,
    lastUpdated: '2025-12-22'
  },
  {
    id: 6,
    title: 'Database Optimization',
    description: 'Optimize database queries and structure',
    totalTasks: 7,
    completedTasks: 7,
    progress: 100,
    lastUpdated: '2025-12-21'
  }
];

function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState(mockProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      const created = await projectApi.createProject({ title: title.trim(), description: description.trim() || undefined });
      setIsCreateOpen(false);
      setLoading(false);
      setProjects((prev) => [{
        id: created?.id ?? Math.random(),
        title: created?.title ?? title.trim(),
        description: created?.description ?? (description.trim() || ''),
        totalTasks: 0,
        completedTasks: 0,
        progress: 0,
        lastUpdated: new Date().toISOString().slice(0,10)
      }, ...prev]);
      console.log('Project created, refresh list');
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

  const handleDeleteProject = (projectId) => {
    // Remove the project locally (hardcoded data for now)
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    console.log('Project deleted:', projectId);
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
          {filteredProjects.map((p) => (
            <ProjectCardWithActions
              key={p.id}
              project={p}
              onProjectClick={handleProjectClick}
              onDeleteProject={handleDeleteProject}
            />
          ))}
          {filteredProjects.length === 0 && (
            <div style={{ color: 'var(--text-muted)' }}>No projects found.</div>
          )}
        </div>
      </section>
    </DashboardLayout>
  );
};

export default Projects;