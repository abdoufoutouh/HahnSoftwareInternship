import React from 'react';

const Sidebar = () => {
  return (
    <aside className="sidebar panel">
      <div className="brand">Hahn Software</div>
      <nav>
        <a href="#" className="active">Projects</a>
        <a href="#">Tasks</a>
        <a href="#">Settings</a>
      </nav>
    </aside>
  );
};

export default Sidebar;
