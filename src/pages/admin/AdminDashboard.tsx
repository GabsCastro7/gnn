import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import Dashboard from '../../components/admin/Dashboard';
import NewsManagement from '../../components/admin/NewsManagement';
import UserManagement from '../../components/admin/UserManagement';
import Analytics from '../../components/admin/Analytics';
import MediaLibrary from '../../components/admin/MediaLibrary';
import SEOSettings from '../../components/admin/SEOSettings';
import GeneralSettings from '../../components/admin/GeneralSettings';

const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
            <Route path="/news" element={<NewsManagement />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/media" element={<MediaLibrary />} />
            <Route path="/seo" element={<SEOSettings />} />
            <Route path="/settings" element={<GeneralSettings />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;