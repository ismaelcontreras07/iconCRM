// src/components/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="wrapper">
      <Sidebar />

      <div className="main_container">
        {/* Aquí se renderizan Dashboard, Leads, etc. */}
        <Outlet />
      </div>
    </div>
  );
}
  