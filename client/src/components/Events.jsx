import React from 'react';

const Events = () => {
  return (
    <div className="p-4">
      <div className="flex items-center space-x-2">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6 2a1 1 0 00-1 1v1H3a1 1 0 00-1 1v2h16V5a1 1 0 00-1-1h-2V3a1 1 0 00-1-1H6zm9 5H5V6h10v1zM4 9a1 1 0 00-1 1v7a1 1 0 001 1h12a1 1 0 001-1v-7a1 1 0 00-1-1H4zm1 2h10v6H5v-6z"/>
        </svg>
        <span>Events</span>
      </div>
    </div>
  );
};

export default Events;
