import React from 'react';
import { useAuth } from '../../auth/AuthContext';

const Topbar = ({ title = 'Dashboard' }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // Hardcoded small user info for display
  const userInitials = 'JD';
  const userName = 'John Doe';

  return (
    <header className="topbar">
      <div className="title">{title}</div>
      <div className="user-box">
        <div className="avatar" aria-hidden>{userInitials}</div>
        <div className="user-meta">
          <div style={{ fontWeight: 600 }}>{userName}</div>
        </div>
        <button className="logout-btn" onClick={handleLogout} aria-label="Log out">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;
