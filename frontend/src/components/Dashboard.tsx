import React from 'react';
import Link from 'next/link';
import { ShieldAlert, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { getDashboardOverview, formatRelativeTime } from '@/lib/incidents';

type StatCard = {
  name: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  alert: boolean;
};

function ActivityIcon(props: any) {
  return <ShieldAlert {...props} />;
}
function AlertIcon(props: any) {
  return <AlertTriangle {...props} />;
}
function CheckIcon(props: any) {
  return <CheckCircle {...props} />;
}
function TimeIcon(props: any) {
  return <Clock {...props} />;
}

export const Dashboard = async () => {
  const { incidents, stats } = await getDashboardOverview();
  const cards: StatCard[] = [
    { name: 'Active Incidents', value: String(stats.activeIncidents), icon: ActivityIcon, alert: true },
    { name: 'Critical Alerts', value: String(stats.criticalAlerts), icon: AlertIcon, alert: true },
    { name: 'Resolved Today', value: String(stats.resolvedToday), icon: CheckIcon, alert: false },
    { name: 'Avg. Response', value: stats.avgResponse, icon: TimeIcon, alert: false },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((stat) => (
          <div key={stat.name} className={`bg-white p-6 border ${stat.alert ? 'border-black' : 'border-gray-200'} rounded-lg shadow-sm flex flex-col justify-between`}>
            <div className="flex justify-between items-start">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{stat.name}</p>
              <stat.icon className={`h-5 w-5 ${stat.alert ? 'text-black' : 'text-gray-400'}`} />
            </div>
            <p className="text-4xl font-black mt-4 text-black">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Incidents Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-black tracking-tight text-black uppercase">Recent Incidents</h2>
          <Link href="/incidents/new" className="bg-black text-white px-4 py-2 text-sm font-bold rounded-md hover:bg-gray-800 transition-colors inline-block text-center">
            NEW INCIDENT
          </Link>
        </div>
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {incidents.length === 0 ? (
                <tr>
                  <td className="px-6 py-12 text-center text-sm text-gray-500" colSpan={6}>
                    No incidents found in the database yet.
                  </td>
                </tr>
              ) : incidents.map((incident) => (
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-medium">{formatRelativeTime(incident.updatedAt ?? incident.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
