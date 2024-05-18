import React from 'react';

const ChannelSection = ({ title, channels, icon }) => {
  return (
    <div className="p-4">
      <div className="uppercase text-xs text-gray-400 mb-2">{title}</div>
      {channels.map((channel) => (
        <div key={channel} className="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-700 cursor-pointer">
          <span>{icon ? icon : '#'}</span>
          <span>{channel}</span>
        </div>
      ))}
    </div>
  );
};

export default ChannelSection;
