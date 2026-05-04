import { getDbPool } from '@/lib/db';

export interface AuditLogEntry {
  auditId: number;
  userId: number;
  username: string;
  timestamp: string | null;
  actions: string[];
}

export async function getAuditLogs(limit = 50): Promise<AuditLogEntry[]> {
  const pool = getDbPool();
  const { rows } = await pool.query(`
    SELECT 
      al.audit_id,
      al.user_id,
      COALESCE(u.username, 'System') AS username,
      al.timestamp,
      ARRAY_AGG(a.action_name) FILTER (WHERE a.action_name IS NOT NULL) AS actions
    FROM audit_log al
    LEFT JOIN "user" u ON al.user_id = u.user_id
    LEFT JOIN audit_log_action ala ON al.audit_id = ala.audit_id
    LEFT JOIN action a ON ala.action_id = a.action_id
    GROUP BY al.audit_id, al.user_id, u.username, al.timestamp
    ORDER BY al.timestamp DESC NULLS LAST
    LIMIT $1
  `, [limit]);

  return rows.map((r: Record<string, unknown>) => ({
    auditId: Number(r.audit_id),
    userId: Number(r.user_id),
    username: String(r.username || 'System'),
    timestamp: r.timestamp instanceof Date ? r.timestamp.toISOString() : (typeof r.timestamp === 'string' ? r.timestamp : null),
    actions: Array.isArray(r.actions) ? r.actions.map(String) : [],
  }));
}

export async function createAuditLog(userId: number, actionNames: string[]): Promise<void> {
  const pool = getDbPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      `INSERT INTO audit_log (user_id, audit_id, timestamp) 
       VALUES ($1, (SELECT COALESCE(MAX(audit_id), 0) + 1 FROM audit_log), NOW()) 
       RETURNING audit_id`,
      [userId],
    );

    const auditId = rows[0]?.audit_id;
    if (!auditId) throw new Error('Failed to create audit log');

    for (const actionName of actionNames) {
      const actionResult = await client.query(
        `SELECT action_id FROM action WHERE action_name = $1`,
        [actionName],
      );

      if (actionResult.rows.length > 0) {
        await client.query(
          `INSERT INTO audit_log_action (audit_id, action_id) VALUES ($1, $2)`,
          [auditId, actionResult.rows[0].action_id],
        );
      }
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
