// src/layouts/DashboardLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        if (typeof window !== 'undefined') {
          return window.innerWidth >= 1024;
        }
        return false;
      });

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Area konten */}
      <div className={`min-h-screen transition-all duration-300 ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-0'}`}>
        <Topbar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <main className="mx-auto w-full max-w-7xl min-w-0 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;