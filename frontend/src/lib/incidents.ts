import { getDbPool } from '@/lib/db';

export type IncidentSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Incident {
  id: number;
  displayId: string;
  incidentType: string;
  status: string;
  reportedTime: string | null;
  lastUpdated: string | null;
}

export interface DashboardStats {
  activeIncidents: number;
  criticalAlerts: number;
  resolvedToday: number;
  avgResponse: string;
  totalIncidents: number;
  totalAssets: number;
  totalTeamMembers: number;
}

export interface CreateIncidentInput {
  incidentType: string;
  status?: string;
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

function normalizeIncident(row: Record<string, unknown>): Incident {
  const id = Number(row.incident_id) || 0;
  return {
    id,
    displayId: `INC-${String(id).padStart(3, '0')}`,
    incidentType: String(row.incident_type || 'Unknown'),
    status: String(row.status || 'New'),
    reportedTime: row.reported_time instanceof Date ? row.reported_time.toISOString() : (typeof row.reported_time === 'string' ? row.reported_time : null),
    lastUpdated: row.last_updated instanceof Date ? row.last_updated.toISOString() : (typeof row.last_updated === 'string' ? row.last_updated : null),
  };
}

export async function getIncidents(limit = 50): Promise<Incident[]> {
  const pool = getDbPool();
  const { rows } = await pool.query(
    `SELECT * FROM incident ORDER BY COALESCE(last_updated, reported_time) DESC NULLS LAST LIMIT $1`,
    [limit],
  );
  return rows.map(normalizeIncident);
}

export async function getIncidentById(id: string | number): Promise<Incident | null> {
  const numericId = typeof id === 'string' ? parseInt(id.replace(/^INC-/i, ''), 10) : id;
  if (isNaN(numericId)) return null;

  const pool = getDbPool();
  const { rows } = await pool.query(`SELECT * FROM incident WHERE incident_id = $1`, [numericId]);

  if (rows.length === 0) return null;
  return normalizeIncident(rows[0]);
}

export async function getDashboardOverview(limit = 5): Promise<{
  incidents: Incident[];
  stats: DashboardStats;
}> {
  const pool = getDbPool();

  const [incidentsResult, statsResult, alertsResult, assetsResult, teamResult] = await Promise.all([
    pool.query(`SELECT * FROM incident ORDER BY COALESCE(last_updated, reported_time) DESC NULLS LAST LIMIT $1`, [limit]),
    pool.query(`SELECT 
      COUNT(*) FILTER (WHERE status NOT IN ('Resolved', 'Closed')) AS active_incidents,
      COUNT(*) AS total_incidents,
      COUNT(*) FILTER (WHERE status = 'Resolved' AND last_updated::date = CURRENT_DATE) AS resolved_today
    FROM incident`),
    pool.query(`SELECT COUNT(*) AS cnt FROM alert WHERE alert_time > NOW() - INTERVAL '24 hours'`),
    pool.query(`SELECT COUNT(*) AS cnt FROM asset`),
    pool.query(`SELECT COUNT(*) AS cnt FROM "user"`),
  ]);

  const incidents = incidentsResult.rows.map(normalizeIncident);
  const stat = statsResult.rows[0] || {};

  const resolvedIncidents = incidentsResult.rows.filter(
    (r: Record<string, unknown>) => r.status === 'Resolved' && r.reported_time && r.last_updated
  );

  const responseDurations = resolvedIncidents.map((r: Record<string, unknown>) => {
    const start = new Date(r.reported_time as string).getTime();
    const end = new Date(r.last_updated as string).getTime();
    return Math.max(0, end - start);
  }).filter((d: number) => d > 0);

  const avgResponse = responseDurations.length > 0
    ? formatDuration(responseDurations.reduce((sum: number, d: number) => sum + d, 0) / responseDurations.length)
    : '—';

  return {
    incidents,
    stats: {
      activeIncidents: Number(stat.active_incidents) || 0,
      criticalAlerts: Number(alertsResult.rows[0]?.cnt) || 0,
      resolvedToday: Number(stat.resolved_today) || 0,
      avgResponse,
      totalIncidents: Number(stat.total_incidents) || 0,
      totalAssets: Number(assetsResult.rows[0]?.cnt) || 0,
      totalTeamMembers: Number(teamResult.rows[0]?.cnt) || 0,
    },
  };
}

export async function createIncident(input: CreateIncidentInput): Promise<Incident> {
  const pool = getDbPool();
  const { rows } = await pool.query(
    `INSERT INTO incident (incident_type, status, reported_time, last_updated) 
     VALUES ($1, $2, NOW(), NOW()) RETURNING *`,
    [input.incidentType, input.status || 'New'],
  );

  if (!rows[0]) throw new Error('Failed to create incident');
  return normalizeIncident(rows[0]);
}

export async function updateIncident(id: number, updates: { status?: string; incidentType?: string }): Promise<Incident> {
  const pool = getDbPool();
  const sets: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (updates.status) {
    sets.push(`status = $${idx++}`);
    values.push(updates.status);
  }
  if (updates.incidentType) {
    sets.push(`incident_type = $${idx++}`);
    values.push(updates.incidentType);
  }

  sets.push(`last_updated = NOW()`);
  values.push(id);

  const { rows } = await pool.query(
    `UPDATE incident SET ${sets.join(', ')} WHERE incident_id = $${idx} RETURNING *`,
    values,
  );

  if (!rows[0]) throw new Error('Incident not found');
  return normalizeIncident(rows[0]);
}

export async function deleteIncident(id: number): Promise<void> {
  const pool = getDbPool();
  // Delete from junction tables first
  await pool.query(`DELETE FROM incident_category WHERE incident_id = $1`, [id]);
  await pool.query(`DELETE FROM incident_team WHERE incident_id = $1`, [id]);
  await pool.query(`DELETE FROM incident_log WHERE incident_id = $1`, [id]);
  await pool.query(`DELETE FROM response_action WHERE incident_id = $1`, [id]);
  await pool.query(`DELETE FROM incident WHERE incident_id = $1`, [id]);
}

export function formatRelativeTime(value: string | null): string {
  if (!value) return 'Recently';

  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) return 'Recently';

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
  if (!value) return 'Unknown';

  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) return value;

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(timestamp));
}