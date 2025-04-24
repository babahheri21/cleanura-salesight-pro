
import React from "react";
import { useData } from "../../context/DataContext";
import { Bell, Search } from "lucide-react";

const TopNavbar = () => {
  const { currentUser } = useData();

  return (
    <header className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
      <div className="flex items-center flex-1">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="block w-full py-2 pl-10 pr-3 text-sm bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:border-cleanura-300 focus:ring focus:ring-cleanura-200 focus:ring-opacity-50"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-1.5 text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-cleanura-300">
          <Bell size={18} />
        </button>
        <div className="flex items-center">
          {currentUser && (
            <>
              <div className="mr-3 text-right">
                <p className="text-sm font-medium text-gray-700">{currentUser.name}</p>
                <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
              </div>
              <div className="flex-shrink-0">
                <img
                  src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=1A6DF0&color=fff`}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
