'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createIncident, updateIncident, deleteIncident } from '@/lib/incidents';

function readValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

export async function createIncidentAction(formData: FormData) {
  const incident = await createIncident({
    incidentType: readValue(formData, 'incidentType'),
    status: readValue(formData, 'status') || 'New',
  });

  revalidatePath('/');
  revalidatePath('/incidents');
  revalidatePath(`/incidents/${incident.id}`);

  redirect(`/incidents/${incident.id}`);
}

export async function updateIncidentAction(formData: FormData) {
  const id = parseInt(readValue(formData, 'id'), 10);
  if (isNaN(id)) throw new Error('Invalid incident ID');

  const status = readValue(formData, 'status');
  const incidentType = readValue(formData, 'incidentType');

  await updateIncident(id, {
    ...(status ? { status } : {}),
    ...(incidentType ? { incidentType } : {}),
  });

  revalidatePath('/');
  revalidatePath('/incidents');
  revalidatePath(`/incidents/${id}`);

  redirect(`/incidents/${id}`);
}

export async function deleteIncidentAction(formData: FormData) {
  const id = parseInt(readValue(formData, 'id'), 10);
  if (isNaN(id)) throw new Error('Invalid incident ID');

  await deleteIncident(id);

  revalidatePath('/');
  revalidatePath('/incidents');

  redirect('/incidents');
}