import { getDbPool } from '@/lib/db';

export type IncidentSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Incident {
  id: string;
  title: string;
  status: string;
  severity: IncidentSeverity;
  assignee: string;
  incidentType: string;
  description: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface DashboardStats {
  activeIncidents: number;
  criticalAlerts: number;
  resolvedToday: number;
  avgResponse: string;
}

export interface CreateIncidentInput {
  title: string;
  severity: IncidentSeverity;
  incidentType: string;
  description: string;
  assignee: string;
  status?: string;
}

type IncidentRow = Record<string, unknown>;

const INCIDENTS_TABLE = 'incidents';

let incidentColumnsCache: Set<string> | null = null;

function readString(row: IncidentRow, keys: string[], fallback = ''): string {
  for (const key of keys) {
    const value = row[key];

    if (typeof value === 'string' && value.trim().length > 0) {
      return value;
    }

    if (typeof value === 'number' && Number.isFinite(value)) {
      return String(value);
    }

    if (value instanceof Date) {
      return value.toISOString();
    }
  }

  return fallback;
}

function readDate(row: IncidentRow, keys: string[]): string | null {
  for (const key of keys) {
    const value = row[key];

    if (value instanceof Date) {
      return value.toISOString();
    }

    if (typeof value === 'string' && value.trim().length > 0) {
      const parsed = new Date(value);
      return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString();
    }

    if (typeof value === 'number' && Number.isFinite(value)) {
      const parsed = new Date(value);
      return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
    }
  }

  return null;
}

function normalizeSeverity(value: string): IncidentSeverity {
  const severity = value.trim().toLowerCase();

  if (severity === 'critical') {
    return 'Critical';
  }

  if (severity === 'high') {
    return 'High';
  }

  if (severity === 'medium') {
    return 'Medium';
  }

  return 'Low';
}

function normalizeStatus(value: string): string {
  const status = value.trim();

  if (!status) {
    return 'New';
  }

  const normalized = status.toLowerCase();

  if (normalized === 'in progress') {
    return 'In Progress';
  }

  if (normalized === 'investigating') {
    return 'Investigating';
  }

  if (normalized === 'triaged') {
    return 'Triaged';
  }

  if (normalized === 'resolved') {
    return 'Resolved';
  }

  if (normalized === 'closed') {
    return 'Closed';
  }

  if (normalized === 'open') {
    return 'Open';
  }

  if (normalized === 'new') {
    return 'New';
  }

  return status;
}

function normalizeIncidentId(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) {
    return 'INC-000';
  }

  if (/^INC-/i.test(trimmed)) {
    return trimmed.toUpperCase();
  }

  if (/^\d+$/.test(trimmed)) {
    return `INC-${trimmed.padStart(3, '0')}`;
  }

  return trimmed;
}

function formatDuration(milliseconds: number): string {
  const totalMinutes = Math.max(1, Math.round(milliseconds / 60000));

  if (totalMinutes < 60) {
    return `${totalMinutes}m`;
  }

  const totalHours = totalMinutes / 60;

  if (totalHours < 24) {
    return `${Math.max(1, Math.round(totalHours))}h`;
  }

  const totalDays = totalHours / 24;
  return `${Math.max(1, Math.round(totalDays))}d`;
}

function parseTime(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function normalizeIncident(row: IncidentRow): Incident {
  const incidentId = readString(row, ['reference', 'public_id', 'incident_id', 'id']);
  const title = readString(row, ['title', 'name'], 'Untitled incident');
  const status = normalizeStatus(readString(row, ['status'], 'New'));
  const severity = normalizeSeverity(readString(row, ['severity'], 'Low'));
  const assignee = readString(row, ['assignee', 'owner', 'assigned_to'], 'Unassigned');
  const incidentType = readString(row, ['incident_type', 'type', 'category'], 'General');
  const description = readString(row, ['description', 'details', 'summary'], '');
  const createdAt = readDate(row, ['created_at', 'createdAt', 'inserted_at', 'timestamp']);
  const updatedAt = readDate(row, ['updated_at', 'updatedAt', 'modified_at']);

  return {
    id: normalizeIncidentId(incidentId),
    title,
    status,
    severity,
    assignee,
    incidentType,
    description,
    createdAt,
    updatedAt,
  };
}

async function getIncidentColumns(): Promise<Set<string>> {
  if (incidentColumnsCache) {
    return incidentColumnsCache;
  }

  const pool = getDbPool();
  const { rows } = await pool.query<{ column_name: string }>(
    `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
    `,
    [INCIDENTS_TABLE],
  );

  incidentColumnsCache = new Set(rows.map((row: { column_name: string }) => row.column_name));
  return incidentColumnsCache;
}

async function queryAllIncidents(): Promise<Incident[]> {
  const pool = getDbPool();
  const { rows } = await pool.query<IncidentRow>(`SELECT * FROM ${INCIDENTS_TABLE}`);

  return rows
    .map((row: IncidentRow) => normalizeIncident(row))
    .sort((left: Incident, right: Incident) => {
      const rightTime = parseTime(right.updatedAt ?? right.createdAt) ?? 0;
      const leftTime = parseTime(left.updatedAt ?? left.createdAt) ?? 0;

      return rightTime - leftTime;
    });
}

export async function getIncidents(limit = 50): Promise<Incident[]> {
  const incidents = await queryAllIncidents();
  return incidents.slice(0, limit);
}

export async function getIncidentById(id: string): Promise<Incident | null> {
  const targetId = normalizeIncidentId(id);
  const incidents = await queryAllIncidents();

  return incidents.find((incident) => incident.id === targetId || incident.id === id) ?? null;
}

export async function getDashboardOverview(limit = 4): Promise<{
  incidents: Incident[];
  stats: DashboardStats;
}> {
  const incidents = await queryAllIncidents();
  const recentIncidents = incidents.slice(0, limit);
  const now = new Date();

  const activeIncidents = incidents.filter((incident) => incident.status.toLowerCase() !== 'resolved').length;
  const criticalAlerts = incidents.filter(
    (incident) => incident.severity === 'Critical' && incident.status.toLowerCase() !== 'resolved',
  ).length;

  const resolvedToday = incidents.filter((incident) => {
    if (incident.status.toLowerCase() !== 'resolved' || !incident.updatedAt) {
      return false;
    }

    const updatedAt = new Date(incident.updatedAt);

    return (
      updatedAt.getFullYear() === now.getFullYear() &&
      updatedAt.getMonth() === now.getMonth() &&
      updatedAt.getDate() === now.getDate()
    );
  }).length;

  const responseDurations = incidents
    .filter((incident) => incident.status.toLowerCase() === 'resolved' && incident.createdAt && incident.updatedAt)
    .map((incident) => {
      const createdAt = Date.parse(incident.createdAt as string);
      const updatedAt = Date.parse(incident.updatedAt as string);

      return Math.max(0, updatedAt - createdAt);
    })
    .filter((duration) => duration > 0);

  const avgResponse = responseDurations.length > 0
    ? formatDuration(responseDurations.reduce((sum, duration) => sum + duration, 0) / responseDurations.length)
    : '—';

  return {
    incidents: recentIncidents,
    stats: {
      activeIncidents,
      criticalAlerts,
      resolvedToday,
      avgResponse,
    },
  };
}

export async function createIncident(input: CreateIncidentInput): Promise<Incident> {
  const title = input.title.trim();

  if (!title) {
    throw new Error('Incident title is required');
  }

  const severity = normalizeSeverity(input.severity);
  const incidentType = input.incidentType.trim() || 'General';
  const description = input.description.trim();
  const assignee = input.assignee.trim() || 'Unassigned';
  const status = normalizeStatus(input.status?.trim() || 'New');

  const columns = await getIncidentColumns();
  const insertColumns: string[] = [];
  const values: unknown[] = [];

  const addColumn = (column: string, value: unknown) => {
    if (columns.has(column)) {
      insertColumns.push(column);
      values.push(value);
    }
  };

  addColumn('title', title);
  addColumn('description', description);
  addColumn('status', status);
  addColumn('severity', severity);
  addColumn('assignee', assignee);

  if (columns.has('incident_type')) {
    addColumn('incident_type', incidentType);
  } else if (columns.has('type')) {
    addColumn('type', incidentType);
  }

  if (insertColumns.length === 0) {
    throw new Error('The incidents table does not expose any writable columns');
  }

  const placeholders = insertColumns.map((_, index) => `$${index + 1}`).join(', ');
  const pool = getDbPool();
  const { rows } = await pool.query<IncidentRow>(
    `INSERT INTO ${INCIDENTS_TABLE} (${insertColumns.join(', ')}) VALUES (${placeholders}) RETURNING *`,
    values,
  );

  const insertedIncident = rows[0];

  if (!insertedIncident) {
    throw new Error('Failed to create incident');
  }

  return normalizeIncident(insertedIncident);
}

export function formatRelativeTime(value: string | null): string {
  if (!value) {
    return 'Recently';
  }

  const timestamp = Date.parse(value);

  if (Number.isNaN(timestamp)) {
    return 'Recently';
  }

  const differenceInMinutes = Math.max(1, Math.round((Date.now() - timestamp) / 60000));

  if (differenceInMinutes < 60) {
    return `${differenceInMinutes} min${differenceInMinutes === 1 ? '' : 's'} ago`;
  }

  const differenceInHours = Math.max(1, Math.round(differenceInMinutes / 60));

  if (differenceInHours < 24) {
    return `${differenceInHours} hour${differenceInHours === 1 ? '' : 's'} ago`;
  }

  const differenceInDays = Math.max(1, Math.round(differenceInHours / 24));
  return `${differenceInDays} day${differenceInDays === 1 ? '' : 's'} ago`;
}

export function formatIncidentTimestamp(value: string | null): string {
  if (!value) {
    return 'Unknown';
  }

  const timestamp = Date.parse(value);

  if (Number.isNaN(timestamp)) {
    return value;
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(timestamp));
}