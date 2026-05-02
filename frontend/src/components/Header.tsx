import React from 'react';
import { Search, Bell } from 'lucide-react';

export const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl font-black tracking-tight text-gray-900 truncate">
          Overview
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </span>
          <input 
            type="text" 
            placeholder="SEARCH..." 
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black sm:text-sm transition-colors font-bold"
          />
        </div>
        <button className="p-2 text-gray-400 hover:text-black transition-colors relative">
          <span className="absolute top-1 right-1 h-2 w-2 bg-black rounded-full"></span>
          <Bell className="h-5 w-5" />
        </button>
        <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center text-white font-bold text-sm">
          A
        </div>
      </div>
    </header>
  );
};
