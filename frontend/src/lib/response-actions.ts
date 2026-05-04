import { getDbPool } from '@/lib/db';

export interface ResponseAction {
  incidentId: number;
  actionId: number;
  actionName: string;
  actionDescription: string;
  actionTime: string | null;
}

export async function getResponseActions(incidentId?: number): Promise<ResponseAction[]> {
  const pool = getDbPool();

  let query = `
    SELECT 
      ra.incident_id,
      ra.action_id,
      COALESCE(a.action_name, 'Unknown') AS action_name,
      COALESCE(ra.action_description, '') AS action_description,
      ra.action_time
    FROM response_action ra
    LEFT JOIN action a ON ra.action_id = a.action_id
  `;

  const values: unknown[] = [];

  if (incidentId !== undefined) {
    query += ` WHERE ra.incident_id = $1`;
    values.push(incidentId);
  }

  query += ` ORDER BY ra.action_time DESC NULLS LAST`;

  const { rows } = await pool.query(query, values);
  return rows.map((r: Record<string, unknown>) => ({
    incidentId: Number(r.incident_id),
    actionId: Number(r.action_id),
    actionName: String(r.action_name || 'Unknown'),
    actionDescription: String(r.action_description || ''),
    actionTime: r.action_time instanceof Date ? r.action_time.toISOString() : (typeof r.action_time === 'string' ? r.action_time : null),
  }));
}

export async function createResponseAction(input: {
  incidentId: number;
  actionId: number;
  actionDescription: string;
}): Promise<ResponseAction> {
  const pool = getDbPool();
  const { rows } = await pool.query(
    `INSERT INTO response_action (incident_id, action_id, action_description, action_time) 
     VALUES ($1, $2, $3, NOW()) RETURNING *`,
    [input.incidentId, input.actionId, input.actionDescription],
  );

  if (!rows[0]) throw new Error('Failed to create response action');

  const actionResult = await pool.query(`SELECT action_name FROM action WHERE action_id = $1`, [input.actionId]);

  return {
    incidentId: Number(rows[0].incident_id),
    actionId: Number(rows[0].action_id),
    actionName: String(actionResult.rows[0]?.action_name || 'Unknown'),
    actionDescription: String(rows[0].action_description || ''),
    actionTime: rows[0].action_time instanceof Date ? rows[0].action_time.toISOString() : null,
  };
}

export async function deleteResponseAction(incidentId: number, actionId: number): Promise<void> {
  const pool = getDbPool();
  await pool.query(
    `DELETE FROM response_action WHERE incident_id = $1 AND action_id = $2`,
    [incidentId, actionId],
  );
}

export interface Action {
  id: number;
  actionName: string;
}

export async function getActions(): Promise<Action[]> {
  const pool = getDbPool();
  const { rows } = await pool.query(`SELECT action_id, action_name FROM action ORDER BY action_name`);
  return rows.map((r: Record<string, unknown>) => ({
    id: Number(r.action_id),
    actionName: String(r.action_name || 'Unknown'),
  }));
}
