import React from 'react';

const Stat = ({ icon = '📁', label, value, subtext }) => (
  <div className="stat-card">
    <div className="stat-icon" aria-hidden>{icon}</div>
    <div className="stat-body">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {subtext && <div className="subtext">{subtext}</div>}
    </div>
  </div>
);

const StatsCards = ({ totalProjects = 0, totalTasks = 0, completedTasks = 0, overallProgress = 0 }) => {
  return (
    <section className="dashboard-section">
      <div className="stats-grid">
        <Stat icon="📁" label="Total Projects" value={totalProjects} subtext="Active and archived" />
        <Stat icon="📝" label="Total Tasks" value={totalTasks} subtext="Across all projects" />
        <Stat icon="✅" label="Completed Tasks" value={completedTasks} subtext="Well done!" />
        <Stat icon="📈" label="Overall Progress" value={`${overallProgress}%`} subtext="Based on tasks" />
      </div>
    </section>
  );
};

export default StatsCards;
