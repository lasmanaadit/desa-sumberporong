// src/pages/admin/EditProfilePage.jsx
import React from 'react';
import EditProfileForm from '../../components/EditProfileForm';

const AdminEditProfilePage = () => {
  return (
    <div className="min-w-0">
      <EditProfileForm dashboardPath="/admin" />
    </div>
  );
};

export default AdminEditProfilePage;