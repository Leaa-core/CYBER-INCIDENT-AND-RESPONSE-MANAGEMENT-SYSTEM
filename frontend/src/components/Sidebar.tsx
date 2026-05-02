"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldAlert, LayoutDashboard, FileText, Activity, Settings, Users } from 'lucide-react';

export const Sidebar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <ShieldAlert className="w-6 h-6 mr-3" />
        <span className="font-black text-xl tracking-tight">CIRMS</span>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-4">
          <Link href="/" className={`flex items-center px-2 py-2 text-sm font-bold rounded-md transition-colors ${isActive('/') ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-black'}`}>
            <LayoutDashboard className="mr-3 flex-shrink-0 h-5 w-5" />
            Dashboard
          </Link>
          <Link href="/incidents" className={`flex items-center px-2 py-2 text-sm font-bold rounded-md transition-colors ${isActive('/incidents') ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-black'}`}>
            <Activity className="mr-3 flex-shrink-0 h-5 w-5" />
            Incidents
          </Link>
          <Link href="/playbooks" className={`flex items-center px-2 py-2 text-sm font-bold rounded-md transition-colors ${isActive('/playbooks') ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-black'}`}>
            <FileText className="mr-3 flex-shrink-0 h-5 w-5" />
            Playbooks
          </Link>
          <Link href="/team" className={`flex items-center px-2 py-2 text-sm font-bold rounded-md transition-colors ${isActive('/team') ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-black'}`}>
            <Users className="mr-3 flex-shrink-0 h-5 w-5" />
            Team
          </Link>
          <Link href="/settings" className={`flex items-center px-2 py-2 text-sm font-bold rounded-md transition-colors ${isActive('/settings') ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-black'}`}>
            <Settings className="mr-3 flex-shrink-0 h-5 w-5" />
            Settings
          </Link>
        </nav>
      </div>
    </div>
  );
};
