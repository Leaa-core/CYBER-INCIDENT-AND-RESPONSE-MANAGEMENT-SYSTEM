"use client";

import React, { useState } from 'react';

export default function SettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-black uppercase tracking-tight">System Settings</h1>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-black text-black uppercase mb-1">General Profile</h2>
          <p className="text-sm font-medium text-gray-500">Update your organization details and system preferences.</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-black text-gray-900 uppercase">Organization Name</label>
            <input
              type="text"
              defaultValue="Acme Corp Security"
              className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-medium text-black bg-white"
            />
          </div>
          <div className="space-y-2 flex flex-col">
            <label className="block text-sm font-black text-gray-900 uppercase">Data Retention Period (Days)</label>
            <input
              type="number"
              defaultValue={90}
              className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-medium text-black bg-white"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-black text-black uppercase mb-1">Notifications</h2>
          <p className="text-sm font-medium text-gray-500">Control how and when you receive system alerts.</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between max-w-md">
            <div>
              <p className="font-bold text-sm text-gray-900">Email Alerts</p>
              <p className="text-xs text-gray-500 font-medium">Receive critical alerts via email.</p>
            </div>
            <button 
              onClick={() => setEmailAlerts(!emailAlerts)}
              className={`${emailAlerts ? 'bg-black text-white border-transparent' : 'border border-gray-300 text-gray-600 hover:border-black hover:text-black'} px-3 py-1 font-bold text-xs rounded-full transition-colors w-24`}
            >
              {emailAlerts ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>
          <div className="flex items-center justify-between max-w-md border-t border-gray-100 pt-4">
            <div>
              <p className="font-bold text-sm text-gray-900">SMS Notifications</p>
              <p className="text-xs text-gray-500 font-medium">Text messages for Sev-1 incidents.</p>
            </div>
            <button 
              onClick={() => setSmsAlerts(!smsAlerts)}
              className={`${smsAlerts ? 'bg-black text-white border-transparent' : 'border border-gray-300 text-gray-600 hover:border-black hover:text-black'} px-3 py-1 font-bold text-xs rounded-full transition-colors w-24`}
            >
              {smsAlerts ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={() => alert("Settings Saved!")}
          className="bg-black text-white px-6 py-2 text-sm font-bold rounded-md hover:bg-gray-800 transition-colors"
        >
          SAVE CHANGES
        </button>
      </div>
    </div>
  );
}
