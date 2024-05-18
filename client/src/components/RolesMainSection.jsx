// src/components/MainSection.js
import React, { useState } from 'react';

const permissions = [
  { name: 'View Channels', key: 'viewChannels' },
  { name: 'Manage Channels', key: 'manageChannels' },
  // Add all other permissions here
];

const MainSection = ({ selectedRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [checkedPermissions, setCheckedPermissions] = useState({});

  const handleCheckboxChange = (key) => {
    setCheckedPermissions({
      ...checkedPermissions,
      [key]: !checkedPermissions[key],
    });
  };

  const filteredPermissions = permissions.filter(permission =>
    permission.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-3/5 bg-gray-900 text-white p-4">
      <h2 className="text-lg font-bold mb-4">{selectedRole || 'Select a role'}</h2>
      <input
        type="text"
        placeholder="Search permissions"
        className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {filteredPermissions.map((permission) => (
          <li key={permission.key} className="mb-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={!!checkedPermissions[permission.key]}
                onChange={() => handleCheckboxChange(permission.key)}
                className="mr-2"
              />
              {permission.name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MainSection;
