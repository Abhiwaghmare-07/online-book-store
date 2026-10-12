import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo-section">
          <span className="logo-icon">📖</span>
          <div>
            <h1 className="app-title">Online Book Store</h1>
            <p className="app-subtitle">MERN Stack College Assignment</p>
          </div>
        </div>
      </div>
    </header>
  );
};
