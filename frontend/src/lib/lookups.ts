import { getDbPool } from '@/lib/db';

export interface Alert {
  id: number;
  alertType: string;
  alertTime: string | null;
}

export interface Asset {
  id: number;
  assetName: string;
  assetType: string;
  criticality: string;
}

export interface Location {
  id: number;
  locationName: string;
}

export interface IncidentTypeOption {
  id: number;
  typeName: string;
}

export interface SeverityOption {
  id: number;
  severityName: string;
}

export interface StatusOption {
  id: number;
  statusName: string;
}

export interface CategoryOption {
  categoryName: string;
  incidentType: string;
}

// --- Alerts ---
export async function getAlerts(limit = 20): Promise<Alert[]> {
  const pool = getDbPool();
  const { rows } = await pool.query(
    `SELECT alert_id, alert_type, alert_time FROM alert ORDER BY alert_time DESC NULLS LAST LIMIT $1`,
    [limit],
  );
  return rows.map((r: Record<string, unknown>) => ({
    id: Number(r.alert_id),
    alertType: String(r.alert_type || 'Unknown'),
    alertTime: r.alert_time instanceof Date ? r.alert_time.toISOString() : (typeof r.alert_time === 'string' ? r.alert_time : null),
  }));
}

export async function createAlert(alertType: string): Promise<Alert> {
  const pool = getDbPool();
  const { rows } = await pool.query(
    `INSERT INTO alert (alert_type, alert_time) VALUES ($1, NOW()) RETURNING *`,
    [alertType],
  );
  if (!rows[0]) throw new Error('Failed to create alert');
  return {
    id: Number(rows[0].alert_id),
    alertType: String(rows[0].alert_type || ''),
    alertTime: rows[0].alert_time instanceof Date ? rows[0].alert_time.toISOString() : null,
  };
}

export async function deleteAlert(id: number): Promise<void> {
  const pool = getDbPool();
  await pool.query(`DELETE FROM alert WHERE alert_id = $1`, [id]);
}

// --- Assets ---
export async function getAssets(): Promise<Asset[]> {
  const pool = getDbPool();
  const { rows } = await pool.query(`SELECT asset_id, asset_name, asset_type, criticality FROM asset ORDER BY asset_id`);
  return rows.map((r: Record<string, unknown>) => ({
    id: Number(r.asset_id),
    assetName: String(r.asset_name || ''),
    assetType: String(r.asset_type || ''),
    criticality: String(r.criticality || 'Medium'),
  }));
}

export async function createAsset(input: { assetName: string; assetType: string; criticality: string }): Promise<Asset> {
  const pool = getDbPool();
  const { rows } = await pool.query(
    `INSERT INTO asset (asset_name, asset_type, criticality) VALUES ($1, $2, $3) RETURNING *`,
    [input.assetName, input.assetType, input.criticality],
  );
  if (!rows[0]) throw new Error('Failed to create asset');
  return {
    id: Number(rows[0].asset_id),
    assetName: String(rows[0].asset_name || ''),
    assetType: String(rows[0].asset_type || ''),
    criticality: String(rows[0].criticality || 'Medium'),
  };
}

export async function deleteAsset(id: number): Promise<void> {
  const pool = getDbPool();
  await pool.query(`DELETE FROM asset WHERE asset_id = $1`, [id]);
}

// --- Locations ---
export async function getLocations(): Promise<Location[]> {
  const pool = getDbPool();
  const { rows } = await pool.query(`SELECT location_id, location_name FROM location ORDER BY location_id`);
  return rows.map((r: Record<string, unknown>) => ({
    id: Number(r.location_id),
    locationName: String(r.location_name || ''),
  }));
}

// --- Lookup tables ---
export async function getIncidentTypes(): Promise<IncidentTypeOption[]> {
  const pool = getDbPool();
  const { rows } = await pool.query(`SELECT type_id, type_name FROM incident_type ORDER BY type_id`);
  return rows.map((r: Record<string, unknown>) => ({
    id: Number(r.type_id),
    typeName: String(r.type_name || ''),
  }));
}

export async function getSeverityLevels(): Promise<SeverityOption[]> {
  const pool = getDbPool();
  const { rows } = await pool.query(`SELECT severity_id, severity_name FROM severity_level ORDER BY severity_id`);
  return rows.map((r: Record<string, unknown>) => ({
    id: Number(r.severity_id),
    severityName: String(r.severity_name || ''),
  }));
}

export async function getIncidentStatuses(): Promise<StatusOption[]> {
  const pool = getDbPool();
  const { rows } = await pool.query(`SELECT status_id, status_name FROM incident_status ORDER BY status_id`);
  return rows.map((r: Record<string, unknown>) => ({
    id: Number(r.status_id),
    statusName: String(r.status_name || ''),
  }));
}

export async function getCategories(): Promise<CategoryOption[]> {
  const pool = getDbPool();
  const { rows } = await pool.query(`SELECT category_name, incident_type FROM category ORDER BY category_name`);
  return rows.map((r: Record<string, unknown>) => ({
    categoryName: String(r.category_name || ''),
    incidentType: String(r.incident_type || ''),
  }));
}
