import React from 'react';
import ProjectCard from './ProjectCards';

const ProjectCardWithActions = ({ project, onProjectClick, onDeleteProject }) => {
  return (
    <div className="project-card-with-actions">
      <ProjectCard project={project} onClick={onProjectClick} />
      <div className="card-actions">
        <button
          className="btn btn-secondary"
          onClick={() => onProjectClick && onProjectClick(project.id)}
        >
          Voir détails
        </button>
        <button
          className="btn btn-danger"
          onClick={() => onDeleteProject && onDeleteProject(project.id)}
        >
          Supprimer
        </button>
      </div>
    </div>
  );
};

export default ProjectCardWithActions;
