import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getIncidentById, formatIncidentTimestamp, formatRelativeTime } from '@/lib/incidents';
import { getResponseActions } from '@/lib/response-actions';
import { getIncidentStatuses } from '@/lib/lookups';
import { updateIncidentAction, deleteIncidentAction } from '@/app/incidents/actions';

export const dynamic = 'force-dynamic';

export default async function IncidentDetailPage({ params }: { params: { id: string } }) {
  const incident = await getIncidentById(params.id);

  if (!incident) {
    notFound();
  }

  const [responseActions, statuses] = await Promise.all([
    getResponseActions(incident.id),
    getIncidentStatuses(),
  ]);

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center space-x-4">
          <Link href="/incidents" className="text-sm font-bold text-gray-500 hover:text-black">
            ← BACK
          </Link>
          <h1 className="text-2xl font-black uppercase tracking-tight">Incident: {incident.displayId}</h1>
        </div>
        <form action={deleteIncidentAction}>
          <input type="hidden" name="id" value={incident.id} />
          <button type="submit" className="px-4 py-2 border border-gray-300 text-gray-600 text-sm font-bold rounded-md hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors">
            DELETE
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Update Status */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-black text-black uppercase mb-4">Update Status</h2>
            <form action={updateIncidentAction} className="flex items-end space-x-3">
              <input type="hidden" name="id" value={incident.id} />
              <div className="flex-1 space-y-2">
                <label htmlFor="status" className="block text-sm font-bold text-gray-500 uppercase">New Status</label>
                <select
                  id="status"
                  name="status"
                  defaultValue={incident.status}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-medium bg-white"
                >
                  {statuses.map((s) => (
                    <option key={s.id} value={s.statusName}>{s.statusName}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="bg-black text-white px-4 py-2 text-sm font-bold rounded-md hover:bg-gray-800 transition-colors whitespace-nowrap">
                UPDATE
              </button>
            </form>
          </div>

          {/* Response Actions */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-black text-black uppercase mb-4">Response Actions</h2>
            <div className="space-y-4">
              {responseActions.length === 0 ? (
                <p className="text-sm font-medium text-gray-500">No response actions recorded for this incident yet.</p>
              ) : responseActions.map((action, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-black"></div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{action.actionName}</p>
                    {action.actionDescription && (
                      <p className="text-sm text-gray-600 mt-0.5">{action.actionDescription}</p>
                    )}
                    <p className="text-xs font-medium text-gray-500">{formatRelativeTime(action.actionTime)}</p>
                  </div>
                </div>
              ))}
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
              <p className="text-xs font-bold text-gray-500 uppercase">Incident Type</p>
              <p className="font-bold text-black border border-gray-200 inline-block px-2 py-1 text-sm mt-1 rounded-sm">{incident.incidentType.toUpperCase()}</p>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Reported</p>
              <p className="font-medium text-gray-900 mt-1">{formatIncidentTimestamp(incident.reportedTime)}</p>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Last Updated</p>
              <p className="font-medium text-gray-900 mt-1">{formatIncidentTimestamp(incident.lastUpdated)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
