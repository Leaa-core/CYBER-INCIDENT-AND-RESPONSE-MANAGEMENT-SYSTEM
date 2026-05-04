import React from 'react';
import Link from 'next/link';
import { getCategories } from '@/lib/lookups';
import { getResponseActions } from '@/lib/response-actions';
import { formatRelativeTime } from '@/lib/incidents';

export const dynamic = 'force-dynamic';

export default async function PlaybooksPage() {
  const [categories, recentActions] = await Promise.all([
    getCategories(),
    getResponseActions(),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black uppercase tracking-tight">Playbooks & Response</h1>
      </div>

      {/* Incident Categories / Playbook Templates */}
      <div>
        <h2 className="text-lg font-black text-black uppercase mb-4">Incident Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.length === 0 ? (
            <p className="text-sm text-gray-500 font-medium col-span-3">No categories configured in the database.</p>
          ) : categories.map((cat) => (
            <div key={cat.categoryName} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col justify-between hover:border-black transition-colors group">
              <div>
                <h3 className="text-lg font-black text-black mb-2 group-hover:underline">{cat.categoryName}</h3>
                <p className="text-sm font-medium text-gray-600 mb-4">Covers incidents of type: {cat.incidentType}</p>
              </div>
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-gray-100 border border-gray-200 text-xs font-bold text-gray-800 rounded-sm uppercase">
                  {cat.incidentType}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Response Actions */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-black text-black uppercase">Recent Response Actions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Incident</th>
                <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentActions.length === 0 ? (
                <tr>
                  <td className="px-6 py-12 text-center text-sm text-gray-500" colSpan={4}>
                    No response actions have been recorded yet.
                  </td>
                </tr>
              ) : recentActions.map((action, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-black">
                    <Link href={`/incidents/${action.incidentId}`} className="hover:underline">
                      INC-{String(action.incidentId).padStart(3, '0')}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-black text-white">
                      {action.actionName}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium max-w-xs truncate">{action.actionDescription || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-medium">{formatRelativeTime(action.actionTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
