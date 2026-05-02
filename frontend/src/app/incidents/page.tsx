import React from 'react';
import Link from 'next/link';

export default function IncidentsPage() {
  const incidents = [
    { id: 'INC-001', title: 'Unauthorized Access Attempt', status: 'In Progress', severity: 'Critical', time: '10 mins ago', assignee: 'Alice M.' },
    { id: 'INC-002', title: 'Malware Detected on ENDPOINT-4', status: 'Investigating', severity: 'High', time: '1 hour ago', assignee: 'John D.' },
    { id: 'INC-003', title: 'Suspicious Lateral Movement', status: 'Triaged', severity: 'Medium', time: '3 hours ago', assignee: 'System' },
    { id: 'INC-004', title: 'Phishing Campaign Reported', status: 'Resolved', severity: 'Low', time: '5 hours ago', assignee: 'Alice M.' },
    { id: 'INC-005', title: 'DDoS Attack on Main Gateway', status: 'In Progress', severity: 'Critical', time: '1 day ago', assignee: 'Security Team' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black uppercase tracking-tight">Incidents</h1>
        <Link href="/incidents/new" className="bg-black text-white px-4 py-2 text-sm font-bold rounded-md hover:bg-gray-800 transition-colors">
          NEW INCIDENT
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Assignee</th>
                <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-right text-xs font-black text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {incidents.map((incident) => (
                <tr key={incident.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-black">{incident.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{incident.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      incident.status === 'Resolved' ? 'bg-gray-100 text-gray-800' : 'bg-black text-white'
                    }`}>
                      {incident.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`font-bold ${incident.severity === 'Critical' ? 'text-black underline decoration-2' : incident.severity === 'High' ? 'text-gray-900' : 'text-gray-500'}`}>
                      {incident.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">{incident.assignee}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-medium">{incident.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                    <Link href={`/incidents/${incident.id}`} className="text-black font-bold hover:underline">VIEW</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
