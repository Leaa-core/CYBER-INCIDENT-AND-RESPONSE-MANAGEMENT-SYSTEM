import React from 'react';
import Link from 'next/link';
import { createTeamMemberAction } from '@/app/team/actions';

export default function NewTeamMemberPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/team" className="text-sm font-bold text-gray-500 hover:text-black">
          ← BACK
        </Link>
        <h1 className="text-2xl font-black uppercase tracking-tight">Add Team Member</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-6">
        <form action={createTeamMemberAction} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-black text-gray-900 uppercase">Full Name</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              placeholder="e.g. John Doe"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-medium"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-black text-gray-900 uppercase">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="e.g. john@company.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-medium"
            />
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
            <Link href="/team" className="px-4 py-2 border border-gray-300 text-black text-sm font-bold rounded-md hover:bg-gray-50 transition-colors">
              CANCEL
            </Link>
            <button type="submit" className="bg-black text-white px-4 py-2 text-sm font-bold rounded-md hover:bg-gray-800 transition-colors">
              ADD MEMBER
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
