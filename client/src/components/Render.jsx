// src/App.js
import React from 'react';
import SideBar from './ParticipantsSideBar';

const Render = () => {
  const users = [
    { id: 1, name: 'Peter', status: 'online' },
    { id: 2, name: 'deepak_sridhar', status: 'offline' },
    { id: 3, name: 'rajesh.cos179', status: 'offline' },
  ];

  return (
    <div className="flex">
      <SideBar users={users} />
      <div className="flex-1 p-4">
        {/* Your main content goes here */}
      </div>
    </div>
  );
};

export default Render;
