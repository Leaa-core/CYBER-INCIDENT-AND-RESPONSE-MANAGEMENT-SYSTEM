import React from 'react';
import { getDbPool } from '@/lib/db';
import { getAssets, getLocations, getIncidentTypes, getSeverityLevels, getIncidentStatuses } from '@/lib/lookups';
import { getTeamMembers } from '@/lib/team';

export const dynamic = 'force-dynamic';

async function testConnection(): Promise<{ connected: boolean; version: string; tables: number }> {
  try {
    const pool = getDbPool();
    const versionResult = await pool.query('SELECT version()');
    const tablesResult = await pool.query(`
      SELECT COUNT(*) AS cnt 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    return {
      connected: true,
      version: String(versionResult.rows[0]?.version || '').split(' ').slice(0, 2).join(' '),
      tables: Number(tablesResult.rows[0]?.cnt || 0),
    };
  } catch {
    return { connected: false, version: '', tables: 0 };
  }
}

export default async function SettingsPage() {
  const [dbStatus, assets, locations, incidentTypes, severityLevels, statuses, members] = await Promise.all([
    testConnection(),
    getAssets(),
    getLocations(),
    getIncidentTypes(),
    getSeverityLevels(),
    getIncidentStatuses(),
    getTeamMembers(),
  ]);

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-black uppercase tracking-tight">System Settings</h1>

      {/* Database Connection Status */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-black text-black uppercase mb-1">Database Connection</h2>
          <p className="text-sm font-medium text-gray-500">Supabase PostgreSQL backend status.</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className={`h-3 w-3 rounded-full ${dbStatus.connected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
            <span className="text-sm font-bold text-gray-900">
              {dbStatus.connected ? 'CONNECTED' : 'DISCONNECTED'}
            </span>
          </div>
          {dbStatus.connected && (
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Database Version</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{dbStatus.version}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Tables</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{dbStatus.tables} tables</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Host</p>
                <p className="text-sm font-medium text-gray-900 mt-1">db.pkeallwuvbcckrvxwdrr.supabase.co</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Database</p>
                <p className="text-sm font-medium text-gray-900 mt-1">postgres</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Data Overview */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-black text-black uppercase mb-1">Data Overview</h2>
          <p className="text-sm font-medium text-gray-500">Summary of all data stored in the system.</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-md p-4">
              <p className="text-xs font-bold text-gray-500 uppercase">Users</p>
              <p className="text-2xl font-black text-black mt-1">{members.length}</p>
            </div>
            <div className="border border-gray-200 rounded-md p-4">
              <p className="text-xs font-bold text-gray-500 uppercase">Assets</p>
              <p className="text-2xl font-black text-black mt-1">{assets.length}</p>
            </div>
            <div className="border border-gray-200 rounded-md p-4">
              <p className="text-xs font-bold text-gray-500 uppercase">Locations</p>
              <p className="text-2xl font-black text-black mt-1">{locations.length}</p>
            </div>
            <div className="border border-gray-200 rounded-md p-4">
              <p className="text-xs font-bold text-gray-500 uppercase">Incident Types</p>
              <p className="text-2xl font-black text-black mt-1">{incidentTypes.length}</p>
            </div>
            <div className="border border-gray-200 rounded-md p-4">
              <p className="text-xs font-bold text-gray-500 uppercase">Severity Levels</p>
              <p className="text-2xl font-black text-black mt-1">{severityLevels.length}</p>
            </div>
            <div className="border border-gray-200 rounded-md p-4">
              <p className="text-xs font-bold text-gray-500 uppercase">Statuses</p>
              <p className="text-2xl font-black text-black mt-1">{statuses.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Assets */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-black text-black uppercase mb-1">Tracked Assets</h2>
          <p className="text-sm font-medium text-gray-500">IT assets monitored by the system.</p>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Asset Name</th>
              <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Criticality</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assets.length === 0 ? (
              <tr>
                <td className="px-6 py-8 text-center text-sm text-gray-500" colSpan={3}>No assets configured.</td>
              </tr>
            ) : assets.map((asset) => (
              <tr key={asset.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-bold text-black">{asset.assetName}</td>
                <td className="px-6 py-4 text-sm text-gray-600 font-medium">{asset.assetType}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    asset.criticality === 'Critical' ? 'bg-black text-white' :
                    asset.criticality === 'High' ? 'border border-black text-black' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {asset.criticality.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Locations */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-black text-black uppercase mb-1">Locations</h2>
          <p className="text-sm font-medium text-gray-500">Infrastructure locations monitored.</p>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-2">
            {locations.length === 0 ? (
              <p className="text-sm text-gray-500 font-medium">No locations configured.</p>
            ) : locations.map((loc) => (
              <span key={loc.id} className="px-3 py-1.5 bg-gray-100 border border-gray-200 text-xs font-bold text-gray-800 rounded-sm">
                {loc.locationName}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Configuration lookup tables */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-black text-black uppercase">Incident Types</h3>
          </div>
          <div className="p-4 space-y-1">
            {incidentTypes.map((t) => (
              <div key={t.id} className="text-sm font-medium text-gray-700 py-1 border-b border-gray-50 last:border-0">{t.typeName}</div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-black text-black uppercase">Severity Levels</h3>
          </div>
          <div className="p-4 space-y-1">
            {severityLevels.map((s) => (
              <div key={s.id} className="text-sm font-medium text-gray-700 py-1 border-b border-gray-50 last:border-0">{s.severityName}</div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-black text-black uppercase">Statuses</h3>
          </div>
          <div className="p-4 space-y-1">
            {statuses.map((s) => (
              <div key={s.id} className="text-sm font-medium text-gray-700 py-1 border-b border-gray-50 last:border-0">{s.statusName}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
