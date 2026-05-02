"use client";

import React from 'react';

export default function PlaybooksPage() {
  const playbooks = [
    { title: 'Ransomware Response', description: 'Steps to contain and recover from a ransomware attack.', tags: ['Malware', 'Critical'] },
    { title: 'Phishing Protocol', description: 'Guidance for analyzing and neutralizing phishing campaigns.', tags: ['Email', 'High'] },
    { title: 'DDoS Mitigation', description: 'Routing and shielding procedures during volumetric attacks.', tags: ['Network', 'Medium'] },
    { title: 'Insider Threat', description: 'Handling unauthorized data access by an employee.', tags: ['Data', 'High'] },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black uppercase tracking-tight">Playbooks</h1>
        <button onClick={() => alert('Create Playbook workflow triggered')} className="bg-black text-white px-4 py-2 text-sm font-bold rounded-md hover:bg-gray-800 transition-colors">
          CREATE PLAYBOOK
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {playbooks.map((pb, idx) => (
          <div key={idx} onClick={() => alert(`Launching playbook: ${pb.title}`)} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col justify-between hover:border-black transition-colors cursor-pointer group">
            <div>
              <h2 className="text-lg font-black text-black mb-2 group-hover:underline">{pb.title}</h2>
              <p className="text-sm font-medium text-gray-600 mb-4">{pb.description}</p>
            </div>
            <div className="flex space-x-2">
              {pb.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-gray-100 border border-gray-200 text-xs font-bold text-gray-800 rounded-sm uppercase">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
