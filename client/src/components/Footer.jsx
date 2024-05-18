import React from 'react';

const Footer = ({ user, status }) => {
  return (
    <div className="flex items-center p-4 bg-gray-800">
      <div className="flex items-center space-x-2">
        <div className="relative">
          <div className="w-8 h-8 bg-green-500 rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-800 rounded-full"></div>
        </div>
        <div>
          <div className="font-semibold">{user}</div>
          <div className="text-xs text-gray-400">{status}</div>
        </div>
      </div>
      <div className="ml-auto flex items-center space-x-2">
        <button className="p-2 rounded hover:bg-gray-700">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6.3 4.3a1 1 0 011.4 0l3 3a1 1 0 01-1.4 1.4L7 7.414V14a1 1 0 11-2 0V7.414l-2.3 2.3a1 1 0 01-1.4-1.4l3-3zM13 10a1 1 0 100-2H7a1 1 0 100 2h6zm-6 4a1 1 0 100-2H7a1 1 0 100 2h6zm0 4a1 1 0 100-2H7a1 1 0 100 2h6z"/>
          </svg>
        </button>
        <button className="p-2 rounded hover:bg-gray-700">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.293 2.293a1 1 0 011.414 0L15 6.586l.707.707A1 1 0 0114.293 8.707l-3-3V14a1 1 0 11-2 0V5.707l-3 3A1 1 0 013.707 6.707l.707-.707L9.293 2.293z"/>
          </svg>
        </button>
        <button className="p-2 rounded hover:bg-gray-700">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414L11.414 13l2.293 2.293a1 1 0 01-1.414 1.414L10 14.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 13l-2.293-2.293a1 1 0 010-1.414z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Footer;
