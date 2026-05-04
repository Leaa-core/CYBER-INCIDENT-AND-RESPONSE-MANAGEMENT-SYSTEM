ALTER TABLE incident
ADD COLUMN IF NOT EXISTS asset_id INTEGER REFERENCES asset(asset_id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_incident_asset_id ON incident(asset_id);

ALTER TABLE "user"
ADD COLUMN IF NOT EXISTS role_id INTEGER REFERENCES role(role_id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_user_role_id ON "user"(role_id);
