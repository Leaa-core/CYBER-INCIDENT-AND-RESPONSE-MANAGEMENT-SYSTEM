import { getDbPool } from '@/lib/db';

export interface TeamMember {
  id: number;
  username: string;
  email: string;
  roleId?: number;
  roleName?: string;
}

export interface ResponseTeam {
  id: number;
  teamName: string;
}

export interface Role {
  id: number;
  roleName: string;
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const pool = getDbPool();
  const { rows } = await pool.query(
    `SELECT u.user_id, u.username, u.email
     FROM "user" u
     ORDER BY u.user_id`
  );
  return rows.map((r: Record<string, unknown>) => ({
    id: Number(r.user_id),
    username: String(r.username || ''),
    email: String(r.email || ''),
  }));
}

export async function getTeamMemberById(id: number): Promise<TeamMember | null> {
  const pool = getDbPool();
  const { rows } = await pool.query(
    `SELECT u.user_id, u.username, u.email
     FROM "user" u
     WHERE u.user_id = $1`,
    [id]
  );
  if (rows.length === 0) return null;
  const r = rows[0];
  return {
    id: Number(r.user_id),
    username: String(r.username || ''),
    email: String(r.email || ''),
  };
}

export async function createTeamMember(input: { username: string; email: string; roleId?: number }): Promise<TeamMember> {
  const pool = getDbPool();
  // Note: roleId support pending database schema update (add role_id column to user table)
  const { rows } = await pool.query(
    `INSERT INTO "user" (username, email) VALUES ($1, $2) RETURNING *`,
    [input.username, input.email],
  );
  if (!rows[0]) throw new Error('Failed to create team member');
  return {
    id: Number(rows[0].user_id),
    username: String(rows[0].username || ''),
    email: String(rows[0].email || ''),
  };
}

export async function updateTeamMember(id: number, input: { username?: string; email?: string; roleId?: number }): Promise<TeamMember> {
  const pool = getDbPool();
  const sets: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (input.username !== undefined) {
    sets.push(`username = $${idx++}`);
    values.push(input.username);
  }
  if (input.email !== undefined) {
    sets.push(`email = $${idx++}`);
    values.push(input.email);
  }
  // Note: roleId support pending database schema update (add role_id column to user table)

  if (sets.length === 0) throw new Error('No fields to update');

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE "user" SET ${sets.join(', ')} WHERE user_id = $${idx} RETURNING *`,
    values,
  );

  if (!rows[0]) throw new Error('Team member not found');
  return {
    id: Number(rows[0].user_id),
    username: String(rows[0].username || ''),
    email: String(rows[0].email || ''),
  };
}

export async function deleteTeamMember(id: number): Promise<void> {
  const pool = getDbPool();
  // Clean up audit_log references first
  await pool.query(`DELETE FROM audit_log WHERE user_id = $1`, [id]);
  await pool.query(`DELETE FROM "user" WHERE user_id = $1`, [id]);
}

export async function getResponseTeams(): Promise<ResponseTeam[]> {
  const pool = getDbPool();
  const { rows } = await pool.query(`SELECT team_id, team_name FROM response_team ORDER BY team_id`);
  return rows.map((r: Record<string, unknown>) => ({
    id: Number(r.team_id),
    teamName: String(r.team_name || ''),
  }));
}

export async function createResponseTeam(teamName: string): Promise<ResponseTeam> {
  const pool = getDbPool();
  const { rows } = await pool.query(
    `INSERT INTO response_team (team_name) VALUES ($1) RETURNING *`,
    [teamName],
  );
  if (!rows[0]) throw new Error('Failed to create response team');
  return {
    id: Number(rows[0].team_id),
    teamName: String(rows[0].team_name || ''),
  };
}

export async function deleteResponseTeam(id: number): Promise<void> {
  const pool = getDbPool();
  await pool.query(`DELETE FROM response_team WHERE team_id = $1`, [id]);
}

export async function getRoles(): Promise<Role[]> {
  const pool = getDbPool();
  const { rows } = await pool.query(`SELECT role_id, role_name FROM role ORDER BY role_id`);
  return rows.map((r: Record<string, unknown>) => ({
    id: Number(r.role_id),
    roleName: String(r.role_name || ''),
  }));
}
