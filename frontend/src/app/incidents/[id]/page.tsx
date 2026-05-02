import React from 'react';
import Link from 'next/link';

export default function IncidentDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center space-x-4 border-b border-gray-200 pb-4">
        <Link href="/incidents" className="text-sm font-bold text-gray-500 hover:text-black">
          ← BACK
        </Link>
        <h1 className="text-2xl font-black uppercase tracking-tight">Incident Details: {params.id}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-black text-black uppercase mb-4">Description</h2>
            <p className="text-gray-700 font-medium leading-relaxed">
              This is a detailed view of incident {params.id}. Evidence of unauthorized access was detected originating from an external IP address.
              The associated user account has been temporarily locked while the investigation proceeds.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-black text-black uppercase mb-4">Action Log</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-black"></div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Account locked</p>
                  <p className="text-xs font-medium text-gray-500">10 mins ago by System</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-gray-300"></div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Incident created</p>
                  <p className="text-xs font-medium text-gray-500">15 mins ago by Monitoring Alert</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-black text-black uppercase mb-4">Properties</h2>
            
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Status</p>
              <p className="font-bold text-black border border-black inline-block px-2 py-1 text-sm mt-1 rounded-sm">IN PROGRESS</p>
            </div>
            
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Severity</p>
              <p className="font-bold text-black border border-gray-200 inline-block px-2 py-1 text-sm mt-1 rounded-sm">CRITICAL</p>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Assignee</p>
              <p className="font-medium text-gray-900 mt-1">Alice M.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
