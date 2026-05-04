'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createIncident, updateIncident, deleteIncident } from '@/lib/incidents';
import { createResponseAction } from '@/lib/response-actions';

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
  const userId = readValue(formData, 'userId');

  await updateIncident(id, {
    ...(status ? { status } : {}),
    ...(incidentType ? { incidentType } : {}),
    ...(userId ? { userId: parseInt(userId, 10) } : {}),
  });

  revalidatePath('/');
  revalidatePath('/incidents');
  revalidatePath(`/incidents/${id}`);

  redirect(`/incidents/${id}`);
}

export async function createResponseActionAction(formData: FormData) {
  const incidentId = parseInt(readValue(formData, 'incidentId'), 10);
  const actionId = parseInt(readValue(formData, 'actionId'), 10);
  const actionDescription = readValue(formData, 'actionDescription');

  if (isNaN(incidentId) || isNaN(actionId)) {
    throw new Error('Invalid incident or action ID');
  }

  await createResponseAction({
    incidentId,
    actionId,
    actionDescription,
  });

  revalidatePath('/incidents');
  revalidatePath(`/incidents/${incidentId}`);
  revalidatePath('/playbooks');
}

export async function assignIncidentAction(formData: FormData) {
  const id = parseInt(readValue(formData, 'incidentId'), 10);
  const userId = readValue(formData, 'userId');

  if (isNaN(id)) throw new Error('Invalid incident ID');

  await updateIncident(id, {
    userId: userId ? parseInt(userId, 10) : undefined,
  });

  revalidatePath(`/incidents/${id}`);
  revalidatePath('/incidents');
  revalidatePath('/');
}

export async function deleteIncidentAction(formData: FormData) {
  const id = parseInt(readValue(formData, 'id'), 10);
  if (isNaN(id)) throw new Error('Invalid incident ID');

  await deleteIncident(id);

  revalidatePath('/');
  revalidatePath('/incidents');

  redirect('/incidents');
}