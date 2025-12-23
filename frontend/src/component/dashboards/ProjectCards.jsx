import React from 'react';
import ProgressBar from './ProgressBar';

const ProjectCard = ({ project, onClick }) => {
  const { id, title, description, totalTasks, completedTasks, progress } = project;
  
  // Ensure progress is a valid number between 0 and 100
  const progressValue = typeof progress === 'number' ? Math.max(0, Math.min(100, progress)) : 0;

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
        <ProgressBar percent={progressValue} ariaLabel={`${title} progress`} />
      </div>
    </div>
  );
};

export default ProjectCard;