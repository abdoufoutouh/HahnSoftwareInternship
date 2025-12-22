import React from 'react';
import ProgressBar from './ProgressBar';

const ProjectCard = ({ project, onClick }) => {
  const { id, title, description, totalTasks, completedTasks, progress } = project;

  const handleClick = () => {
    if (onClick) onClick(id);
  };

  return (
    <div className="project-card" onClick={handleClick} role="button" tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' ? handleClick() : null)}>
      <div className="project-folder-tab" aria-hidden></div>
      <div className="project-body">
        <h3 className="project-title">{title}</h3>
        <p className="project-desc">{description}</p>
        <div className="project-meta">{completedTasks} completed • {totalTasks} tasks</div>
      </div>
      <div className="progress-wrap">
        <ProgressBar percent={progress} ariaLabel={`${title} progress`} />
      </div>
    </div>
  );
};

export default ProjectCard;