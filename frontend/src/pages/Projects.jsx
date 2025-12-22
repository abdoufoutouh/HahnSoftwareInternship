/**
 * Projects Dashboard Page
 * Main dashboard view showing projects and statistics
 */

import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import DashboardLayout from '../component/dashboards/DashboardLayout';
import StatsCards from '../component/dashboards/StatsCards';
import ProjectsSection from '../component/dashboards/ProjectsSection';

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
  const [projects] = useState(mockProjects);
  const [searchTerm, setSearchTerm] = useState('');

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
    // TODO: Implement project creation
    console.log('Create new project');
  };

  const handleProjectClick = (projectId) => {
    // TODO: Navigate to project details
    console.log('Project clicked:', projectId);
  };

  return (
    <DashboardLayout pageTitle="My Projects">
      {/* Stats Cards */}
      <StatsCards 
        totalProjects={totalProjects}
        totalTasks={totalTasks}
        completedTasks={completedTasks}
        overallProgress={overallProgress}
      />

      {/* Projects Section */}
      <ProjectsSection
        projects={filteredProjects}
        onSearch={handleSearch}
        onCreateProject={handleCreateProject}
        onProjectClick={handleProjectClick}
      />
    </DashboardLayout>
  );
};

export default Projects;
