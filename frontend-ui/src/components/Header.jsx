import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// Use UI image: header.png for header layout
// Based on the dark grey header with application title and navigation tabs
const Header = () => {
  const location = useLocation();
  
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="app-title">Merchant Category Code (MCC) Miscoding</h1>
          <nav className="header-nav">
            <Link 
              to="/" 
              className={`nav-tab ${location.pathname === '/' ? 'active' : ''}`}
            >
              Alerts
            </Link>
            <Link 
              to="/cases" 
              className={`nav-tab ${location.pathname.includes('/cases') ? 'active' : ''}`}
            >
              Cases
            </Link>
          </nav>
        </div>
        <div className="header-right">
          <div className="user-avatar">
            <div className="avatar-circle">
              <span className="avatar-text">MC</span>
            </div>
            <span className="user-name">MCCANALYST</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;



