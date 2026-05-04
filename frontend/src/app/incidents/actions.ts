'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createIncident, type IncidentSeverity } from '@/lib/incidents';

function readValue(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === 'string' ? value : '';
}

function normalizeSeverity(value: string): IncidentSeverity {
  const normalized = value.trim().toLowerCase();

  if (normalized === 'critical') {
    return 'Critical';
  }

  if (normalized === 'high') {
    return 'High';
  }

  if (normalized === 'medium') {
    return 'Medium';
  }

  return 'Low';
}

export async function createIncidentAction(formData: FormData) {
  const incident = await createIncident({
    title: readValue(formData, 'title'),
    severity: normalizeSeverity(readValue(formData, 'severity')),
    incidentType: readValue(formData, 'incidentType'),
    description: readValue(formData, 'description'),
    assignee: readValue(formData, 'assignee'),
    status: readValue(formData, 'status') || 'New',
  });

  revalidatePath('/');
  revalidatePath('/incidents');
  revalidatePath(`/incidents/${incident.id}`);

  redirect(`/incidents/${incident.id}`);
}