// src/Sidebar.js
import React from 'react';

const Sidebar = () => {
  const menuItems = [
    "Overview",
    "Roles",
    "Emoji",
    "Stickers",
    "Soundboard",
    "Widget",
    "Server Template",
    "Custom Invite Link",
    "Apps",
    "Integrations",
    "App Directory",
    "Moderation",
    "Safety Setup",
    "AutoMod",
    "Audit Log",
    "Bans",
    "Community",
    "Enable Community",
    "Monetization",
    "Server Subscriptions",
    "Server Boost Status",
    "User Management",
    "Members",
    "Invites",
    "Delete Server"
  ];

  return (
    <div className="w-64 h-screen bg-gray-900 text-white overflow-y-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Peter's Server</h2>
      <ul>
        {menuItems.map((item, index) => (
          <li key={index} className="mb-2">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
