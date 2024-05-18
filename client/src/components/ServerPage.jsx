// src/App.js
import React from 'react';
import Sidebar from './ServerMenuItems';
import MainContent from './ServerMainContent';

const ServerPage = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <MainContent />
    </div>
  );
};

export default ServerPage;
