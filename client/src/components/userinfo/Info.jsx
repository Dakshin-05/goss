import React from 'react';

const Info = ({ username, discriminator, memberSince }) => {
  return (
    <div className="text mt-10 mb-4">
      <h2 className="text-xl font-bold">{username}</h2>
      <p className="text-gray-400">#{discriminator}</p>
      <hr></hr>
      <p className="mt-2 text-sm">Member since: {new Date(memberSince).toDateString().slice(3)}</p>
    </div>
  );
};

export default Info;
