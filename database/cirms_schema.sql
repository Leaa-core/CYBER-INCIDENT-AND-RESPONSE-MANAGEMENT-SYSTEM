-- CIRMS database schema for MySQL Workbench
-- This script creates the core tables used by the frontend and seeds sample data.

CREATE DATABASE IF NOT EXISTS cirms
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE cirms;

SET FOREIGN_KEY_CHECKS = 0;
DROP VIEW IF EXISTS v_dashboard_summary;
DROP TABLE IF EXISTS incident_activities;
DROP TABLE IF EXISTS playbook_tag_map;
DROP TABLE IF EXISTS playbook_tags;
DROP TABLE IF EXISTS playbooks;
DROP TABLE IF EXISTS incidents;
DROP TABLE IF EXISTS team_members;
DROP TABLE IF EXISTS notification_settings;
DROP TABLE IF EXISTS organizations;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE organizations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL UNIQUE,
  data_retention_days INT NOT NULL DEFAULT 90,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE notification_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  organization_id INT NOT NULL UNIQUE,
  email_alerts BOOLEAN NOT NULL DEFAULT TRUE,
  sms_alerts BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_notification_settings_organization
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE team_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  organization_id INT NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role VARCHAR(100) NOT NULL,
  status ENUM('On Call', 'Offline', 'Active') NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_team_members_organization
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE incidents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  organization_id INT NOT NULL,
  incident_code VARCHAR(20) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  incident_type ENUM('Malware', 'Phishing', 'Data Breach', 'DDoS', 'Other') NOT NULL,
  severity ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL,
  status ENUM('New', 'Triaged', 'Investigating', 'In Progress', 'Resolved') NOT NULL DEFAULT 'New',
  assigned_to_member_id INT NULL,
  assignee_name VARCHAR(100) NOT NULL,
  reported_at DATETIME NOT NULL,
  first_response_at DATETIME NULL,
  resolved_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_incidents_organization
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_incidents_assignee
    FOREIGN KEY (assigned_to_member_id) REFERENCES team_members(id)
    ON DELETE SET NULL,
  INDEX idx_incidents_status (status),
  INDEX idx_incidents_severity (severity),
  INDEX idx_incidents_reported_at (reported_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE playbooks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  organization_id INT NOT NULL,
  title VARCHAR(150) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_playbooks_organization
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE playbook_tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE playbook_tag_map (
  playbook_id INT NOT NULL,
  tag_id INT NOT NULL,
  PRIMARY KEY (playbook_id, tag_id),
  CONSTRAINT fk_playbook_tag_map_playbook
    FOREIGN KEY (playbook_id) REFERENCES playbooks(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_playbook_tag_map_tag
    FOREIGN KEY (tag_id) REFERENCES playbook_tags(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE incident_activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  incident_id INT NOT NULL,
  activity_type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  actor_name VARCHAR(100) NOT NULL,
  created_at DATETIME NOT NULL,
  CONSTRAINT fk_incident_activities_incident
    FOREIGN KEY (incident_id) REFERENCES incidents(id)
    ON DELETE CASCADE,
  INDEX idx_incident_activities_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO organizations (name, data_retention_days)
VALUES ('Acme Corp Security', 90);

INSERT INTO notification_settings (organization_id, email_alerts, sms_alerts)
VALUES (1, TRUE, FALSE);

INSERT INTO team_members (organization_id, full_name, role, status)
VALUES
  (1, 'Alice M.', 'Incident Commander', 'On Call'),
  (1, 'John D.', 'Security Analyst', 'Offline'),
  (1, 'Sarah W.', 'Forensics Expert', 'Active'),
  (1, 'Michael T.', 'Network Engineer', 'Active');

INSERT INTO incidents (
  organization_id,
  incident_code,
  title,
  description,
  incident_type,
  severity,
  status,
  assigned_to_member_id,
  assignee_name,
  reported_at,
  first_response_at,
  resolved_at
)
VALUES
  (1, 'INC-001', 'Unauthorized Access Attempt', 'Multiple failed login attempts were detected from an external IP address.', 'Other', 'Critical', 'In Progress', 1, 'Alice M.', DATE_SUB(NOW(), INTERVAL 2 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 2 HOUR), INTERVAL 14 MINUTE), NULL),
  (1, 'INC-002', 'Malware Detected on ENDPOINT-4', 'Endpoint telemetry identified malware on ENDPOINT-4 and isolated the host.', 'Malware', 'High', 'Investigating', 2, 'John D.', DATE_SUB(NOW(), INTERVAL 3 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 3 HOUR), INTERVAL 14 MINUTE), NULL),
  (1, 'INC-003', 'Suspicious Lateral Movement', 'Network monitoring flagged lateral movement between internal assets.', 'Other', 'Medium', 'Triaged', NULL, 'System', DATE_SUB(NOW(), INTERVAL 4 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 4 HOUR), INTERVAL 14 MINUTE), NULL),
  (1, 'INC-004', 'Phishing Campaign Reported', 'Users reported a phishing campaign that targeted mailbox credentials.', 'Phishing', 'Low', 'Resolved', 1, 'Alice M.', DATE_SUB(NOW(), INTERVAL 9 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 9 HOUR), INTERVAL 14 MINUTE), DATE_SUB(NOW(), INTERVAL 1 HOUR)),
  (1, 'INC-005', 'DDoS Attack on Main Gateway', 'Inbound traffic spiked sharply against the main gateway and mitigation began.', 'DDoS', 'Critical', 'In Progress', NULL, 'Security Team', DATE_SUB(NOW(), INTERVAL 5 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 5 HOUR), INTERVAL 14 MINUTE), NULL),
  (1, 'INC-006', 'Privilege Escalation Attempt', 'Privilege escalation behavior was detected on a privileged workstation.', 'Other', 'Critical', 'Investigating', 3, 'Sarah W.', DATE_SUB(NOW(), INTERVAL 6 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 6 HOUR), INTERVAL 14 MINUTE), NULL),
  (1, 'INC-007', 'Suspicious VPN Login', 'A suspicious VPN login originated from an unfamiliar location.', 'Other', 'High', 'Triaged', 4, 'Michael T.', DATE_SUB(NOW(), INTERVAL 7 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 7 HOUR), INTERVAL 14 MINUTE), NULL),
  (1, 'INC-008', 'Endpoint Malware Sweep', 'A proactive endpoint sweep found dormant malware artifacts.', 'Malware', 'Medium', 'In Progress', 2, 'John D.', DATE_SUB(NOW(), INTERVAL 8 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 8 HOUR), INTERVAL 14 MINUTE), NULL),
  (1, 'INC-009', 'Cloud Storage Access Spike', 'Cloud storage audit logs showed an unusual access spike.', 'Data Breach', 'Low', 'Investigating', 1, 'Alice M.', DATE_SUB(NOW(), INTERVAL 9 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 9 HOUR), INTERVAL 14 MINUTE), NULL),
  (1, 'INC-010', 'Outbound Traffic Anomaly', 'Outbound traffic patterns deviated from the normal baseline.', 'Other', 'High', 'Triaged', NULL, 'Security Team', DATE_SUB(NOW(), INTERVAL 10 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 10 HOUR), INTERVAL 14 MINUTE), NULL),
  (1, 'INC-011', 'Phishing Mailbox Sweep', 'Mailbox sweep confirmed multiple phishing messages had been delivered.', 'Phishing', 'Medium', 'In Progress', 1, 'Alice M.', DATE_SUB(NOW(), INTERVAL 11 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 11 HOUR), INTERVAL 14 MINUTE), NULL),
  (1, 'INC-012', 'Unauthorized USB Device', 'An unapproved USB device was inserted on a secured workstation.', 'Other', 'Low', 'Investigating', 4, 'Michael T.', DATE_SUB(NOW(), INTERVAL 12 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 12 HOUR), INTERVAL 14 MINUTE), NULL),
  (1, 'INC-013', 'Admin Account Drift', 'Administrative account permissions drifted from the approved baseline.', 'Other', 'High', 'Triaged', NULL, 'System', DATE_SUB(NOW(), INTERVAL 13 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 13 HOUR), INTERVAL 14 MINUTE), NULL),
  (1, 'INC-014', 'Email Spoofing Contained', 'Email spoofing activity was blocked and mail rules were updated.', 'Phishing', 'Medium', 'Resolved', 3, 'Sarah W.', DATE_SUB(NOW(), INTERVAL 10 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 10 HOUR), INTERVAL 14 MINUTE), DATE_SUB(NOW(), INTERVAL 1 HOUR)),
  (1, 'INC-015', 'Webshell Removal Completed', 'A suspicious webshell was removed from the application server.', 'Malware', 'High', 'Resolved', 2, 'John D.', DATE_SUB(NOW(), INTERVAL 9 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 9 HOUR), INTERVAL 14 MINUTE), DATE_SUB(NOW(), INTERVAL 1 HOUR)),
  (1, 'INC-016', 'Stolen Credentials Remediated', 'Compromised credentials were rotated and access tokens invalidated.', 'Data Breach', 'Critical', 'Resolved', 1, 'Alice M.', DATE_SUB(NOW(), INTERVAL 8 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 8 HOUR), INTERVAL 14 MINUTE), DATE_SUB(NOW(), INTERVAL 1 HOUR)),
  (1, 'INC-017', 'DNS Tunneling Blocked', 'DNS tunneling activity was identified and blocked at the resolver.', 'Other', 'Medium', 'Resolved', NULL, 'Security Team', DATE_SUB(NOW(), INTERVAL 7 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 7 HOUR), INTERVAL 14 MINUTE), DATE_SUB(NOW(), INTERVAL 1 HOUR)),
  (1, 'INC-018', 'Cloud IAM Policy Fixed', 'Incorrect cloud IAM policy bindings were corrected.', 'Other', 'Low', 'Resolved', 4, 'Michael T.', DATE_SUB(NOW(), INTERVAL 6 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 6 HOUR), INTERVAL 14 MINUTE), DATE_SUB(NOW(), INTERVAL 1 HOUR)),
  (1, 'INC-019', 'Ransomware Sandbox Cleared', 'Ransomware samples were isolated in the sandbox and the host was cleared.', 'Malware', 'Critical', 'Resolved', 3, 'Sarah W.', DATE_SUB(NOW(), INTERVAL 5 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 5 HOUR), INTERVAL 14 MINUTE), DATE_SUB(NOW(), INTERVAL 1 HOUR)),
  (1, 'INC-020', 'Suspicious File Download', 'A suspicious file download was reviewed and dismissed as benign.', 'Other', 'Low', 'Resolved', NULL, 'System', DATE_SUB(NOW(), INTERVAL 4 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 4 HOUR), INTERVAL 14 MINUTE), DATE_SUB(NOW(), INTERVAL 1 HOUR));

INSERT INTO playbooks (organization_id, title, description)
VALUES
  (1, 'Ransomware Response', 'Steps to contain and recover from a ransomware attack.'),
  (1, 'Phishing Protocol', 'Guidance for analyzing and neutralizing phishing campaigns.'),
  (1, 'DDoS Mitigation', 'Routing and shielding procedures during volumetric attacks.'),
  (1, 'Insider Threat', 'Handling unauthorized data access by an employee.');

INSERT INTO playbook_tags (name)
VALUES
  ('Malware'),
  ('Critical'),
  ('Email'),
  ('High'),
  ('Network'),
  ('Medium'),
  ('Data');

INSERT INTO playbook_tag_map (playbook_id, tag_id)
VALUES
  (1, 1),
  (1, 2),
  (2, 3),
  (2, 4),
  (3, 5),
  (3, 6),
  (4, 7),
  (4, 4);

INSERT INTO incident_activities (incident_id, activity_type, message, actor_name, created_at)
VALUES
  (1, 'created', 'Incident was created from repeated authentication failures.', 'Monitoring Alert', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
  (1, 'response', 'Account was locked and the investigation was assigned.', 'System', DATE_SUB(NOW(), INTERVAL 110 MINUTE)),
  (4, 'created', 'Phishing campaign reported by end users.', 'Email Gateway', DATE_SUB(NOW(), INTERVAL 9 HOUR)),
  (4, 'resolved', 'Campaign was blocked and user mailbox rules were updated.', 'Alice M.', DATE_SUB(NOW(), INTERVAL 1 HOUR)),
  (5, 'created', 'Traffic surge detected at the main gateway.', 'Network Sensor', DATE_SUB(NOW(), INTERVAL 5 HOUR)),
  (5, 'response', 'Mitigation rules were applied at the edge.', 'Security Team', DATE_SUB(NOW(), INTERVAL 250 MINUTE));

CREATE VIEW v_dashboard_summary AS
SELECT
  o.id AS organization_id,
  o.name AS organization_name,
  SUM(CASE WHEN i.status IN ('New', 'Triaged', 'Investigating', 'In Progress') THEN 1 ELSE 0 END) AS active_incidents,
  SUM(CASE WHEN i.severity = 'Critical' AND i.status IN ('New', 'Triaged', 'Investigating', 'In Progress') THEN 1 ELSE 0 END) AS critical_alerts,
  SUM(CASE WHEN i.status = 'Resolved' AND DATE(i.resolved_at) = CURDATE() THEN 1 ELSE 0 END) AS resolved_today,
  ROUND(AVG(CASE WHEN i.first_response_at IS NOT NULL THEN TIMESTAMPDIFF(MINUTE, i.reported_at, i.first_response_at) END), 0) AS avg_response_minutes
FROM organizations o
LEFT JOIN incidents i ON i.organization_id = o.id
GROUP BY o.id, o.name;

-- Optional helper query for Workbench:
-- SELECT * FROM v_dashboard_summary;
