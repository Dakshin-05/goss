import React from 'react';

const ServerHeader = () => {
  return (
    <div className="flex items-center p-4 bg-gray-800">
      <h1 className="text-lg font-bold">Pentagon server</h1>
      <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 3a1 1 0 01.832.445l7 9a1 1 0 01-.832 1.555H3a1 1 0 01-.832-1.555l7-9A1 1 0 0110 3zm0 4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
      </svg>
    </div>
  );
};

export default ServerHeader;
