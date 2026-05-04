import React from 'react';
import { getAssets } from '@/lib/lookups';

export const dynamic = 'force-dynamic';

export default async function AssetsPage() {
  const assets = await getAssets();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black uppercase tracking-tight">Assets</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Asset Name</th>
                <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Criticality</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assets.length === 0 ? (
                <tr>
                  <td className="px-6 py-12 text-center text-sm text-gray-500" colSpan={4}>
                    No assets are tracked in the system yet.
                  </td>
                </tr>
              ) : assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-black">AST-{String(asset.id).padStart(3, '0')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{asset.assetName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{asset.assetType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
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
      </div>
    </div>
  );
}
