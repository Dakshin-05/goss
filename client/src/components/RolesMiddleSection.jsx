// src/components/MiddleSection.js
import React from 'react';

const roles = ['new role', '@everyone']; // Sample data

const MiddleSection = ({ setSelectedRole }) => {
  return (
    <div className="w-1/5 bg-gray-700 text-white p-4">
      <h2 className="text-lg font-bold mb-4">Roles</h2>
      <ul>
        {roles.map((role, index) => (
          <li
            key={index}
            className="mb-2 cursor-pointer"
            onClick={() => setSelectedRole(role)}
          >
            {role}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MiddleSection;
