import React from 'react';
import Link from 'next/link';
import { createIncidentAction } from '@/app/incidents/actions';

export default function NewIncidentPage() {
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
            <label htmlFor="title" className="block text-sm font-black text-gray-900 uppercase">Incident Title</label>
            <input
              type="text"
              id="title"
              name="title"
              required
              placeholder="e.g. Unauthorized Access Attempt"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="severity" className="block text-sm font-black text-gray-900 uppercase">Severity</label>
              <select
                id="severity"
                name="severity"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-medium bg-white"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="type" className="block text-sm font-black text-gray-900 uppercase">Incident Type</label>
              <select
                id="type"
                name="incidentType"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-medium bg-white"
              >
                <option>Malware</option>
                <option>Phishing</option>
                <option>Data Breach</option>
                <option>DDoS</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="assignee" className="block text-sm font-black text-gray-900 uppercase">Assignee</label>
            <input
              type="text"
              id="assignee"
              name="assignee"
              placeholder="e.g. Security Team"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-medium"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-black text-gray-900 uppercase">Description</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              placeholder="Provide a detailed description of the incident..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-medium"
            />
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
