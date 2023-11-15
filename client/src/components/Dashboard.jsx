import React from "react";

const Dahsboard = () => {
  return (
    <div style={{ maxWidth: '280px' }} className="flex flex-col h-screen bg-gray-800 text-white">
    {/* Top Bar/Header */}
    <div className="flex items-center justify-between h-16 px-4 shadow-md">
      <h1 className="text-lg font-bold">WebDesk</h1>
      <div className="space-x-2">
        <button>🔍</button> {/* Search Icon */}
        <button>☰</button> {/* Menu Icon */}
      </div>
    </div>

    {/* Primary Navigation */}
    <div className="flex flex-col px-4 mt-2">
      <button className="flex items-center py-2 text-sm font-medium hover:bg-gray-700">
        Threads
      </button>
      <button className="flex items-center py-2 text-sm font-medium hover:bg-gray-700">
        All DMs
      </button>
      <button className="flex items-center py-2 text-sm font-medium hover:bg-gray-700">
        Mentions & reactions
      </button>
      {/* ... more primary navigation items */}
    </div>

    {/* Channels Section */}
    <div className="px-4 mt-2">
      <h2 className="text-xs font-semibold text-gray-500 uppercase">Channels</h2>
      {/* List of channels */}
      <div className="mt-1">
        <button className="flex items-center py-2 text-sm font-medium hover:bg-gray-700">
          # channel-1
        </button>
        <button className="flex items-center py-2 text-sm font-medium hover:bg-gray-700">
          # channel-2
        </button>
        {/* ... more channels */}
      </div>
    </div>

    {/* Direct Messages Section */}
    <div className="px-4 mt-2">
      <h2 className="text-xs font-semibold text-gray-500 uppercase">Direct Messages</h2>
      {/* List of DMs */}
      <div className="mt-1">
        <button className="flex items-center py-2 text-sm font-medium hover:bg-gray-700">
          User 1
        </button>
        <button className="flex items-center py-2 text-sm font-medium hover:bg-gray-700">
          User 2
        </button>
        {/* ... more DMs */}
      </div>
    </div>

    {/* Secondary Navigation/Footer */}
    <div className="px-4 mt-2">
      <button className="flex items-center py-2 text-sm font-medium hover:bg-gray-700">
        Files
      </button>
      <button className="flex items-center py-2 text-sm font-medium hover:bg-gray-700">
        Preferences
      </button>
      <button className="flex items-center py-2 text-sm font-medium hover:bg-gray-700">
        Help
      </button>
    </div>
  </div>
  );
};

export default Dahsboard;
