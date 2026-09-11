// src/pages/superadmin/EditProfilePage.jsx
import React from 'react';
import EditProfileForm from '../../components/EditProfileForm';

const SuperAdminEditProfilePage = () => {
  return (
    <div className="min-w-0">
      <EditProfileForm dashboardPath="/superadmin" />
    </div>
  );
};

export default SuperAdminEditProfilePage;