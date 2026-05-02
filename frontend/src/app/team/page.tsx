"use client";

import React from 'react';

export default function TeamPage() {
  const members = [
    { name: 'Alice M.', role: 'Incident Commander', status: 'On Call' },
    { name: 'John D.', role: 'Security Analyst', status: 'Offline' },
    { name: 'Sarah W.', role: 'Forensics Expert', status: 'Active' },
    { name: 'Michael T.', role: 'Network Engineer', status: 'Active' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black uppercase tracking-tight">Team Members</h1>
        <button onClick={() => alert('Invite member dialog triggered')} className="bg-black text-white px-4 py-2 text-sm font-bold rounded-md hover:bg-gray-800 transition-colors">
          INVITE MEMBER
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-black text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map((member, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-black">{member.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{member.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    member.status === 'On Call' ? 'border border-black text-black' :
                    member.status === 'Active' ? 'bg-gray-100 text-gray-800' :
                    'text-gray-400'
                  }`}>
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                  <button onClick={() => alert(`Managing profile for ${member.name}`)} className="text-black font-bold hover:underline">MANAGE</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
