import React, { useState } from 'react';
import ProjectCard from './ProjectCards';

const ProjectsSection = ({ projects = [], onSearch, onCreateProject, onProjectClick }) => {
  const [term, setTerm] = useState('');

  const handleSearchChange = (e) => {
    const v = e.target.value;
    setTerm(v);
    onSearch && onSearch(v);
  };

  return (
    <section className="dashboard-section">
      <div className="projects-header">
        <h2 style={{ margin: 0 }}>Projects</h2>
        <div className="controls">
          <button className="create-btn" onClick={onCreateProject}>Create Project</button>
          <label aria-label="Search projects" style={{ display: 'contents' }}>
            <input
              type="text"
              className="search-input"
              placeholder="Search projects..."
              value={term}
              onChange={handleSearchChange}
            />
          </label>
        </div>
      </div>

      <div className="projects-grid">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} onClick={onProjectClick} />
        ))}
        {projects.length === 0 && (
          <div style={{ color: 'var(--text-muted)' }}>No projects found.</div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
