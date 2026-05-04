ALTER TABLE incident
ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES "user"(user_id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_incident_user_id ON incident(user_id);
