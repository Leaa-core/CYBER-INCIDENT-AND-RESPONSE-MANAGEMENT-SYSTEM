import React from 'react';
import Link from 'next/link';
import { ShieldAlert, CheckCircle, Clock, AlertTriangle, Users, Server, Activity } from 'lucide-react';
import { getDashboardOverview, formatRelativeTime } from '@/lib/incidents';
import { getAlerts } from '@/lib/lookups';

type StatCard = {
  name: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  alert: boolean;
  href?: string;
};

function ActivityIcon(props: { className?: string }) {
  return <ShieldAlert {...props} />;
}
function AlertIcon(props: { className?: string }) {
  return <AlertTriangle {...props} />;
}
function CheckIcon(props: { className?: string }) {
  return <CheckCircle {...props} />;
}
function TimeIcon(props: { className?: string }) {
  return <Clock {...props} />;
}
function UsersIcon(props: { className?: string }) {
  return <Users {...props} />;
}
function ServerIcon(props: { className?: string }) {
  return <Server {...props} />;
}

export const Dashboard = async () => {
  const [{ incidents, stats }, alerts] = await Promise.all([
    getDashboardOverview(),
    getAlerts(5),
  ]);

  const cards: StatCard[] = [
    { name: 'Active Incidents', value: String(stats.activeIncidents), icon: ActivityIcon, alert: stats.activeIncidents > 0, href: '/incidents' },
    { name: 'Alerts (24h)', value: String(stats.criticalAlerts), icon: AlertIcon, alert: stats.criticalAlerts > 0, href: '/alerts' },
    { name: 'Resolved Today', value: String(stats.resolvedToday), icon: CheckIcon, alert: false },
    { name: 'Avg. Response', value: stats.avgResponse, icon: TimeIcon, alert: false },
    { name: 'Team Members', value: String(stats.totalTeamMembers), icon: UsersIcon, alert: false, href: '/team' },
    { name: 'Tracked Assets', value: String(stats.totalAssets), icon: ServerIcon, alert: false, href: '/assets' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((stat) => {
          const content = (
            <div className={`bg-white p-5 border ${stat.alert ? 'border-black' : 'border-gray-200'} rounded-lg shadow-sm flex flex-col justify-between transition-all hover:shadow-md ${stat.href ? 'cursor-pointer hover:border-black' : ''}`}>
              <div className="flex justify-between items-start">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.name}</p>
                <stat.icon className={`h-4 w-4 ${stat.alert ? 'text-black' : 'text-gray-400'}`} />
              </div>
              <p className="text-3xl font-black mt-3 text-black">{stat.value}</p>
            </div>
          );
          return stat.href ? (
            <Link key={stat.name} href={stat.href}>{content}</Link>
          ) : (
            <div key={stat.name}>{content}</div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incidents Table */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm">
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
                  <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Asset</th>
                  <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-black">
                      <Link href={`/incidents/${incident.id}`} className="hover:underline">{incident.displayId}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{incident.incidentType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">{incident.compromisedAsset ?? 'Unassigned'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">{incident.assignedTo ?? 'Unassigned'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        incident.status === 'Resolved' || incident.status === 'Closed' ? 'bg-gray-100 text-gray-800' : 'bg-black text-white'
                      }`}>
                        {incident.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-medium">{formatRelativeTime(incident.lastUpdated ?? incident.reportedTime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {incidents.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-200">
              <Link href="/incidents" className="text-sm font-bold text-black hover:underline">VIEW ALL INCIDENTS →</Link>
            </div>
          )}
        </div>

        {/* Alerts Panel */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-black tracking-tight text-black uppercase">Recent Alerts</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {alerts.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-gray-500">
                No recent alerts.
              </div>
            ) : alerts.map((alert) => (
              <div key={alert.id} className="px-6 py-4 flex items-start space-x-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-black flex-shrink-0"></div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{alert.alertType}</p>
                  <p className="text-xs font-medium text-gray-500">{formatRelativeTime(alert.alertTime)}</p>
                </div>
              </div>
            ))}
          </div>
          {alerts.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-200">
              <Link href="/alerts" className="text-sm font-bold text-black hover:underline">VIEW ALL ALERTS →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
