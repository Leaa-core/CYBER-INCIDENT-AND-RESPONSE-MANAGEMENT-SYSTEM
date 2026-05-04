"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldAlert, LayoutDashboard, Activity, Settings, Users, AlertTriangle, Server, ClipboardList } from 'lucide-react';

export const Sidebar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || (path !== '/' && pathname.startsWith(path));

  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/incidents', label: 'Incidents', icon: Activity },
    { href: '/alerts', label: 'Alerts', icon: AlertTriangle },
    { href: '/assets', label: 'Assets', icon: Server },
    { href: '/team', label: 'Team', icon: Users },
    { href: '/audit-log', label: 'Audit Log', icon: ClipboardList },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <ShieldAlert className="w-6 h-6 mr-3" />
        <span className="font-black text-xl tracking-tight">CIRMS</span>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.href === '/' ? pathname === '/' : isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-2 py-2 text-sm font-bold rounded-md transition-colors ${
                  active ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <Icon className="mr-3 flex-shrink-0 h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-bold text-gray-500 uppercase">Database Connected</span>
        </div>
      </div>
    </div>
  );
};
