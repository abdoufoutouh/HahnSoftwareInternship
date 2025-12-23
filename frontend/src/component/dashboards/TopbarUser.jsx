import React from 'react';
import { useAuth } from '../../auth/AuthContext';

const TopbarUser = ({ title = 'Dashboard' }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // Resolve connected user's name from localStorage if available
  const firstName = typeof window !== 'undefined' ? localStorage.getItem('firstName') : null;
  const lastName = typeof window !== 'undefined' ? localStorage.getItem('lastName') : null;
  const storedFull = typeof window !== 'undefined' ? localStorage.getItem('fullName') : null;
  const userName = storedFull || [firstName, lastName].filter(Boolean).join(' ') || 'John Doe';
  const userInitials = (userName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => (w && w[0] ? w[0].toUpperCase() : ''))
    .join('')) || 'JD';

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

export default TopbarUser;
