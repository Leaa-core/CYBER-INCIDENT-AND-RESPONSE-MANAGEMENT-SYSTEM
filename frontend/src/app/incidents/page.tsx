import React from 'react';
import Link from 'next/link';
import { getIncidents, formatRelativeTime } from '@/lib/incidents';

export const dynamic = 'force-dynamic';

export default async function IncidentsPage() {
  const incidents = await getIncidents(100);

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
                <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Reported</th>
                <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-3 text-right text-xs font-black text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {incidents.length === 0 ? (
                <tr>
                  <td className="px-6 py-12 text-center text-sm text-gray-500" colSpan={6}>
                    No incidents are stored in the database yet.
                  </td>
                </tr>
              ) : incidents.map((incident) => (
                <tr key={incident.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-black">{incident.displayId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{incident.incidentType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      incident.status === 'Resolved' || incident.status === 'Closed' ? 'bg-gray-100 text-gray-800' : 'bg-black text-white'
                    }`}>
                      {incident.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-medium">{formatRelativeTime(incident.reportedTime)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-medium">{formatRelativeTime(incident.lastUpdated)}</td>
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
