import React from 'react';

const Info = ({ username, discriminator, memberSince }) => {
  return (
    <div className="text-center mb-4">
      <h2 className="text-xl font-bold">{username}</h2>
      <p className="text-gray-400">#{discriminator}</p>
      <p className="mt-2 text-sm">Member since: {memberSince}</p>
    </div>
  );
};

export default Info;
