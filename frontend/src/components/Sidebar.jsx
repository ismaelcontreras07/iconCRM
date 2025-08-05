// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../assets/css/Sidebar.css';
import iconLogo from '../assets/icon2.svg';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapse = () => setCollapsed(!collapsed);

  return (
      <div className={`wrapper ${collapsed ? 'collapse' : ''}`}>
        <div className="top_navbar">
          <div className="hamburger" onClick={toggleCollapse}>
            <div className="one" />
            <div className="two" />
            <div className="three" />
          </div>
          <div className="top_menu">
            <div className="logo">
              <img src={iconLogo} alt="Icon" className="icon-logo" />
            </div>
            <ul>
              {/* <li>
                <NavLink to="/search" className="icon-link">
                  <i className="fas fa-search" />
                </NavLink>
              </li> */}
              <li>
                <NavLink to="/notifications" className="icon-link">
                  <i className="fas fa-bell" />
                </NavLink>
              </li>
              <li>
                <NavLink to="/profile" className="icon-link">
                  <i className="fas fa-user" />
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="sidebar">
          <ul>
            <li>
              <NavLink to="/dashboard" className="sidebar-link">
                <span className="icon"><i className="fas fa-chart-line" /></span>
                <span className="title">Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/leads" className="sidebar-link">
                <span className="icon"><i className="fas fa-user" /></span>
                <span className="title">Leads</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/nature" className="sidebar-link">
                <span className="icon"><i className="fas fa-user-slash" /></span>
                <span className="title">Eliminados</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/movies" className="sidebar-link">
                <span className="icon"><i className="fas fa-briefcase" /></span>
                <span className="title">Contactos</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/sports" className="sidebar-link">
                <span className="icon"><i className="fas fa-building" /></span>
                <span className="title">Cuentas</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/blogs" 
                className="sidebar-link" 
                activeClassName="active"
              >
                <span className="icon"><i className="fas fa-calendar" /></span>
                <span className="title">Actividades</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
  );
}
