import React from 'react';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import '../../styles/dashboard.css';

const DashboardLayout = ({ children, pageTitle = 'Dashboard' }) => {
  return (
    <div className="dashboard-bg">
      <div className="dashboard-wrapper">
        <Sidebar />

        <main className="main">
          <div className="panel">
            <Topbar title={pageTitle} />
            <div className="dashboard-content">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;