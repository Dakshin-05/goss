// src/App.js
import React, { useState } from 'react';
import Sidebar from './RolesSideBar';
import MiddleSection from './RolesMiddleSection';
import MainSection from './RolesMainSection';

const Roles = () => {
  const [selectedRole, setSelectedRole] = useState(null);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <MiddleSection setSelectedRole={setSelectedRole} />
      <MainSection selectedRole={selectedRole} />
    </div>
  );
}

export default Roles;
