// src/Sidebar.js
import React from 'react';

const Sidebar = ({ users }) => {
  const onlineUsers = users.filter(user => user.status === 'online');
  const offlineUsers = users.filter(user => user.status === 'offline');

  return (
    <div className="w-64 h-screen bg-gray-900 text-white overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-bold mb-2">ONLINE — {onlineUsers.length}</h2>
        <ul>
          {onlineUsers.map(user => (
            <li key={user.id} className="flex items-center mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              {user.name}
            </li>
          ))}
        </ul>
        <h2 className="text-lg font-bold mt-4 mb-2">OFFLINE — {offlineUsers.length}</h2>
        <ul className="opacity-50">
          {offlineUsers.map(user => (
            <li key={user.id} className="flex items-center mb-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
              {user.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
