import React from 'react';

const ProgressBar = ({ percent = 0, ariaLabel = 'Progress' }) => {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div className="progress" role="progressbar" aria-label={ariaLabel} aria-valuemin={0} aria-valuemax={100} aria-valuenow={clamped} style={{ flex: 1 }}>
        <div className="progress-inner" style={{ width: `${clamped}%` }} />
      </div>
      <span style={{ fontSize: '12px', color: 'var(--text-muted)', minWidth: '35px', textAlign: 'right' }}>
        {clamped}%
      </span>
    </div>
  );
};

export default ProgressBar;
