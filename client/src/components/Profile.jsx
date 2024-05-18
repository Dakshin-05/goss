import React from 'react';

const ProfileCard = () => {
  return (
    <div className="bg-gray-800 rounded-lg w-80 text-white font-sans">
      <div className="bg-red-500 p-4 rounded-t-lg flex items-center relative">
        <div className="absolute left-4 top-4 w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
          <span className="text-3xl">🎭</span>
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-bold">deepak_sridhar</h2>
        <p className="text-gray-400">@deepak_sridhar</p>
        <div className="mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <span role="img" aria-label="icon" className="text-gray-400">👾</span>
            <span>Apr 4, 2023</span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <span role="img" aria-label="icon" className="text-gray-400">🚀</span>
            <span>Apr 8, 2023</span>
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <span className="bg-blue-500 rounded px-2 py-1 text-sm">Wiz</span>
          <button className="ml-2 bg-transparent border border-white text-white rounded px-2 py-1 text-sm">+</button>
        </div>
        <div className="mt-4 text-gray-400 text-sm">
          <p>Click here to add a note</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
