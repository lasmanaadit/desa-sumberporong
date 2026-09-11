// src/layouts/SuperAdminLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SuperAdminSidebar from '../components/superadmin/SuperAdminSidebar';
import SuperAdminTopbar from '../components/superadmin/SuperAdminTopbar';

const SuperAdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return false;
  });

  return (
    <div className="min-h-screen bg-background">
      <SuperAdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className={`min-h-screen transition-all duration-300 ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-0'}`}>
        <SuperAdminTopbar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <main className="flex-1 p-6 lg:p-8">
          <div className="w-full max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;