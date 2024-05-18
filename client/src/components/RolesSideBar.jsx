// src/components/Sidebar.js
import React from 'react';

const Sidebar = () => {
  return (
    <div className="w-1/5 bg-gray-800 text-white p-4">
      <h2 className="text-lg font-bold mb-4">PETER'S SERVER</h2>
      <nav>
        <ul>
          <li className="mb-2">Overview</li>
          <li className="mb-2">Roles</li>
          <li className="mb-2">Emoji</li>
          {/* Add other sidebar items */}
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
