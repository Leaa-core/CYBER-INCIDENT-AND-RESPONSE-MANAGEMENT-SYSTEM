'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createTeamMember, updateTeamMember, deleteTeamMember } from '@/lib/team';

function readValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

export async function createTeamMemberAction(formData: FormData) {
  const username = readValue(formData, 'username').trim();
  const email = readValue(formData, 'email').trim();

  if (!username || !email) throw new Error('Username and email are required');

  await createTeamMember({ username, email });

  revalidatePath('/');
  revalidatePath('/team');

  redirect('/team');
}

export async function updateTeamMemberAction(formData: FormData) {
  const id = parseInt(readValue(formData, 'id'), 10);
  if (isNaN(id)) throw new Error('Invalid member ID');

  const username = readValue(formData, 'username').trim();
  const email = readValue(formData, 'email').trim();

  await updateTeamMember(id, {
    ...(username ? { username } : {}),
    ...(email ? { email } : {}),
  });

  revalidatePath('/');
  revalidatePath('/team');

  redirect('/team');
}

export async function deleteTeamMemberAction(formData: FormData) {
  const id = parseInt(readValue(formData, 'id'), 10);
  if (isNaN(id)) throw new Error('Invalid member ID');

  await deleteTeamMember(id);

  revalidatePath('/');
  revalidatePath('/team');

  redirect('/team');
}
