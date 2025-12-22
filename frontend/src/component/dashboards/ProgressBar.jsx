import React from 'react';

const ProgressBar = ({ percent = 0, ariaLabel = 'Progress' }) => {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className="progress" role="progressbar" aria-label={ariaLabel} aria-valuemin={0} aria-valuemax={100} aria-valuenow={clamped}>
      <div className="progress-inner" style={{ width: `${clamped}%` }} />
    </div>
  );
};

export default ProgressBar;
