-- ==============================================================================
-- PAIMANA PREDICT — MIGRATION 002: PRODUCTION PERFORMANCE INDEXES
-- Smart India Hackathon 2026 • Problem Statement 26103
-- ==============================================================================

-- Projects Master Indexes
CREATE INDEX IF NOT EXISTS idx_projects_code ON projects(project_code);
CREATE INDEX IF NOT EXISTS idx_projects_name ON projects(project_name);
CREATE INDEX IF NOT EXISTS idx_projects_ministry ON projects(ministry_id);
CREATE INDEX IF NOT EXISTS idx_projects_sector ON projects(sector_id);
CREATE INDEX IF NOT EXISTS idx_projects_state ON projects(state_id);
CREATE INDEX IF NOT EXISTS idx_projects_cost_growth ON projects(cost_growth_pct DESC);
CREATE INDEX IF NOT EXISTS idx_projects_progress ON projects(physical_progress);
CREATE INDEX IF NOT EXISTS idx_projects_risk_state ON projects(current_risk_state);

-- Snapshots Indexes
CREATE INDEX IF NOT EXISTS idx_snapshots_project ON project_snapshots(project_id);
CREATE INDEX IF NOT EXISTS idx_snapshots_date_key ON project_snapshots(report_date_key);

-- Early Warnings & Actions Indexes
CREATE INDEX IF NOT EXISTS idx_warnings_project ON early_warnings(project_id);
CREATE INDEX IF NOT EXISTS idx_warnings_status ON early_warnings(status);
CREATE INDEX IF NOT EXISTS idx_predictions_project ON project_predictions(project_id);
CREATE INDEX IF NOT EXISTS idx_actions_project ON project_actions(project_id);
CREATE INDEX IF NOT EXISTS idx_actions_status ON project_actions(status);

-- Notifications & Audit Logs Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);
