import React from 'react';
import Link from 'next/link';
import { createIncidentAction } from '@/app/incidents/actions';
import { getIncidentTypes, getIncidentStatuses } from '@/lib/lookups';

export const dynamic = 'force-dynamic';

export default async function NewIncidentPage() {
  const [incidentTypes, statuses] = await Promise.all([
    getIncidentTypes(),
    getIncidentStatuses(),
  ]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/incidents" className="text-sm font-bold text-gray-500 hover:text-black">
          ← BACK
        </Link>
        <h1 className="text-2xl font-black uppercase tracking-tight">Create New Incident</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-6">
        <form action={createIncidentAction} className="space-y-6">
          <input type="hidden" name="status" value="New" />

          <div className="space-y-2">
            <label htmlFor="incidentType" className="block text-sm font-black text-gray-900 uppercase">Incident Type</label>
            <select
              id="incidentType"
              name="incidentType"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-medium bg-white"
            >
              {incidentTypes.map((type) => (
                <option key={type.id} value={type.typeName}>{type.typeName}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="block text-sm font-black text-gray-900 uppercase">Initial Status</label>
            <select
              id="status"
              name="status"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-medium bg-white"
            >
              {statuses.map((s) => (
                <option key={s.id} value={s.statusName}>{s.statusName}</option>
              ))}
            </select>
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
            <Link href="/incidents" className="px-4 py-2 border border-gray-300 text-black text-sm font-bold rounded-md hover:bg-gray-50 transition-colors">
              CANCEL
            </Link>
            <button type="submit" className="bg-black text-white px-4 py-2 text-sm font-bold rounded-md hover:bg-gray-800 transition-colors">
              SUBMIT INCIDENT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
