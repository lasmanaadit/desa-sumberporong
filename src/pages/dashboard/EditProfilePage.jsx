// src/pages/dashboard/EditProfilePage.jsx
import React from 'react';
import EditProfileForm from '../../components/EditProfileForm';

const EditProfilePage = () => {
  return (
    <div className="min-w-0">
      <EditProfileForm dashboardPath="/dashboard" />
    </div>
  );
};

export default EditProfilePage;