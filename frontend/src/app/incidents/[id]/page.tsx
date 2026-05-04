import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getIncidentById, formatIncidentTimestamp, formatRelativeTime } from '@/lib/incidents';

export const dynamic = 'force-dynamic';

export default async function IncidentDetailPage({ params }: { params: { id: string } }) {
  const incident = await getIncidentById(params.id);

  if (!incident) {
    notFound();
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center space-x-4 border-b border-gray-200 pb-4">
        <Link href="/incidents" className="text-sm font-bold text-gray-500 hover:text-black">
          ← BACK
        </Link>
        <h1 className="text-2xl font-black uppercase tracking-tight">Incident Details: {incident.id}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-black text-black uppercase mb-4">Description</h2>
            <p className="text-gray-700 font-medium leading-relaxed">
              {incident.description || 'No description has been recorded for this incident yet.'}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-black text-black uppercase mb-4">Action Log</h2>
            <div className="space-y-4">
              {incident.updatedAt ? (
                <div className="flex items-start space-x-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-black"></div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Status updated to {incident.status}</p>
                    <p className="text-xs font-medium text-gray-500">{formatRelativeTime(incident.updatedAt)} by {incident.assignee}</p>
                  </div>
                </div>
              ) : null}
              {incident.createdAt ? (
                <div className="flex items-start space-x-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-gray-300"></div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Incident created</p>
                    <p className="text-xs font-medium text-gray-500">{formatRelativeTime(incident.createdAt)} at {formatIncidentTimestamp(incident.createdAt)}</p>
                  </div>
                </div>
              ) : null}
              {!incident.createdAt && !incident.updatedAt ? (
                <p className="text-sm font-medium text-gray-500">No activity timestamps are available for this record yet.</p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-black text-black uppercase mb-4">Properties</h2>
            
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Status</p>
              <p className="font-bold text-black border border-black inline-block px-2 py-1 text-sm mt-1 rounded-sm">{incident.status.toUpperCase()}</p>
            </div>
            
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Severity</p>
              <p className="font-bold text-black border border-gray-200 inline-block px-2 py-1 text-sm mt-1 rounded-sm">{incident.severity.toUpperCase()}</p>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Assignee</p>
              <p className="font-medium text-gray-900 mt-1">{incident.assignee}</p>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Incident Type</p>
              <p className="font-medium text-gray-900 mt-1">{incident.incidentType}</p>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Created</p>
              <p className="font-medium text-gray-900 mt-1">{formatIncidentTimestamp(incident.createdAt)}</p>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Updated</p>
              <p className="font-medium text-gray-900 mt-1">{formatIncidentTimestamp(incident.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
