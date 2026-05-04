import React from 'react';
import Link from 'next/link';
import { getTeamMembers } from '@/lib/team';
import { getResponseTeams, getRoles } from '@/lib/team';
import { deleteTeamMemberAction } from '@/app/team/actions';

export const dynamic = 'force-dynamic';

export default async function TeamPage() {
  const [members, teams, roles] = await Promise.all([
    getTeamMembers(),
    getResponseTeams(),
    getRoles(),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black uppercase tracking-tight">Team Management</h1>
        <Link href="/team/new" className="bg-black text-white px-4 py-2 text-sm font-bold rounded-md hover:bg-gray-800 transition-colors">
          ADD MEMBER
        </Link>
      </div>

      {/* Team Members */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-black text-black uppercase">Users ({members.length})</h2>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-right text-xs font-black text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.length === 0 ? (
              <tr>
                <td className="px-6 py-12 text-center text-sm text-gray-500" colSpan={5}>
                  No team members found in the database.
                </td>
              </tr>
            ) : members.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-black">{member.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-black">{member.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{member.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{member.roleName ?? 'Unassigned'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                  <form action={deleteTeamMemberAction} className="inline">
                    <input type="hidden" name="id" value={member.id} />
                    <button type="submit" className="text-gray-400 font-bold hover:text-red-600 hover:underline transition-colors ml-3">
                      DELETE
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Response Teams */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-black text-black uppercase">Response Teams ({teams.length})</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {teams.length === 0 ? (
              <p className="text-sm text-gray-500 font-medium col-span-3">No response teams configured.</p>
            ) : teams.map((team) => (
              <div key={team.id} className="border border-gray-200 rounded-md px-4 py-3 flex items-center justify-between hover:border-black transition-colors">
                <span className="text-sm font-bold text-black">{team.teamName}</span>
                <span className="text-xs text-gray-400 font-medium">#{team.id}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Roles */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-black text-black uppercase">Roles ({roles.length})</h2>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-2">
            {roles.length === 0 ? (
              <p className="text-sm text-gray-500 font-medium">No roles configured.</p>
            ) : roles.map((role) => (
              <span key={role.id} className="px-3 py-1.5 bg-gray-100 border border-gray-200 text-xs font-bold text-gray-800 rounded-sm uppercase">
                {role.roleName}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
