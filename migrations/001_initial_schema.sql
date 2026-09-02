-- ==============================================================================
-- PAIMANA PREDICT — MIGRATION 001: INITIAL RELATIONAL SCHEMA
-- Smart India Hackathon 2026 • Problem Statement 26103
-- ==============================================================================

-- 1. Administrative Master Tables
CREATE TABLE IF NOT EXISTS ministries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    short_code VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sectors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS states (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    region VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS agencies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    ministry_id INTEGER REFERENCES ministries(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. User Authentication & RBAC Master Tables
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    code VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS permissions (
    id SERIAL PRIMARY KEY,
    code VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    module VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    username VARCHAR(128) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role_id INTEGER REFERENCES roles(id) ON DELETE RESTRICT,
    department VARCHAR(255),
    designation VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_assigned_projects (
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    project_id VARCHAR(64) NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, project_id)
);

-- 3. Core Projects Master Table
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(64) PRIMARY KEY,
    project_code VARCHAR(32) UNIQUE NOT NULL,
    project_name VARCHAR(512) NOT NULL,
    ministry_id INTEGER REFERENCES ministries(id) ON DELETE RESTRICT,
    sector_id INTEGER REFERENCES sectors(id) ON DELETE RESTRICT,
    state_id INTEGER REFERENCES states(id) ON DELETE SET NULL,
    agency_id INTEGER REFERENCES agencies(id) ON DELETE SET NULL,
    
    -- Current Status & Financial Baseline (₹ Crores)
    original_cost NUMERIC(15, 2) NOT NULL,
    revised_cost NUMERIC(15, 2) NOT NULL,
    cumulative_expenditure NUMERIC(15, 2) NOT NULL DEFAULT 0.0,
    cost_overrun_cr NUMERIC(15, 2) DEFAULT 0.0,
    cost_growth_pct NUMERIC(8, 2) DEFAULT 0.0,
    expenditure_ratio_pct NUMERIC(8, 2) DEFAULT 0.0,
    
    -- Schedule Milestones
    approval_date VARCHAR(32),
    start_date VARCHAR(32),
    target_completion_date VARCHAR(32),
    revised_completion_date VARCHAR(32),
    schedule_extension_months INTEGER DEFAULT 0,
    is_schedule_extended BOOLEAN DEFAULT FALSE,
    is_cost_escalated BOOLEAN DEFAULT FALSE,
    physical_progress NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    status VARCHAR(32) NOT NULL DEFAULT 'ONGOING',
    current_risk_state VARCHAR(32) NOT NULL DEFAULT 'ON_TRACK',
    
    -- Cross-Reference Identifiers
    legacy_ocms_code VARCHAR(64),
    pmgid VARCHAR(64),
    
    -- Telemetry & Audit Metadata
    first_observed_snapshot VARCHAR(32),
    last_observed_snapshot VARCHAR(32),
    snapshot_count INTEGER DEFAULT 1,
    last_updated_by VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Project Historical Snapshots (One-to-Many Time Series)
CREATE TABLE IF NOT EXISTS project_snapshots (
    id BIGSERIAL PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    report_period VARCHAR(32) NOT NULL,
    report_date_key VARCHAR(16) NOT NULL,
    source_document VARCHAR(128) NOT NULL,
    source_table VARCHAR(64) NOT NULL,
    original_cost NUMERIC(15, 2) NOT NULL,
    revised_cost NUMERIC(15, 2) NOT NULL,
    cumulative_expenditure NUMERIC(15, 2) NOT NULL,
    physical_progress NUMERIC(5, 2) NOT NULL,
    target_completion_date VARCHAR(32),
    revised_completion_date VARCHAR(32),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_project_snapshot UNIQUE (project_id, report_date_key)
);

-- 5. Ingestion Runs
CREATE TABLE IF NOT EXISTS ingestion_runs (
    id SERIAL PRIMARY KEY,
    report_period VARCHAR(32) NOT NULL,
    source_filename VARCHAR(255) NOT NULL,
    extracted_projects_count INTEGER NOT NULL,
    total_original_cost_cr NUMERIC(15, 2) NOT NULL,
    total_revised_cost_cr NUMERIC(15, 2) NOT NULL,
    total_expenditure_cr NUMERIC(15, 2) NOT NULL,
    reconciliation_status VARCHAR(16) NOT NULL,
    original_cost_diff_pct NUMERIC(6, 4) NOT NULL DEFAULT 0.0,
    revised_cost_diff_pct NUMERIC(6, 4) NOT NULL DEFAULT 0.0,
    expenditure_diff_pct NUMERIC(6, 4) NOT NULL DEFAULT 0.0,
    sha256_checksum VARCHAR(64),
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Model Registry & Predictions
CREATE TABLE IF NOT EXISTS model_registry (
    id SERIAL PRIMARY KEY,
    model_name VARCHAR(128) NOT NULL,
    version VARCHAR(32) NOT NULL,
    algorithm VARCHAR(64) NOT NULL,
    target_variable VARCHAR(64) NOT NULL,
    feature_set JSONB NOT NULL,
    training_sample_count INTEGER NOT NULL,
    validation_strategy VARCHAR(128) NOT NULL,
    roc_auc NUMERIC(5, 4) NOT NULL,
    precision_score NUMERIC(5, 4) NOT NULL,
    recall_score NUMERIC(5, 4) NOT NULL,
    f1_score NUMERIC(5, 4) NOT NULL,
    accuracy_score NUMERIC(5, 4) NOT NULL,
    early_warning_lead_months NUMERIC(4, 2) NOT NULL,
    is_active_production BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_predictions (
    id BIGSERIAL PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    model_id INTEGER REFERENCES model_registry(id) ON DELETE RESTRICT,
    snapshot_date_key VARCHAR(16) NOT NULL,
    predicted_delay_months INTEGER NOT NULL,
    delay_probability NUMERIC(5, 2) NOT NULL,
    cost_exposure_cr NUMERIC(15, 2) NOT NULL,
    cost_overrun_probability NUMERIC(5, 2) NOT NULL,
    risk_level VARCHAR(16) NOT NULL,
    confidence_score NUMERIC(5, 2) NOT NULL,
    feature_contributions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Early Warnings & Recommendations
CREATE TABLE IF NOT EXISTS early_warnings (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    alert_type VARCHAR(64) NOT NULL,
    severity VARCHAR(16) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'DETECTED',
    trigger_reason TEXT NOT NULL,
    evidence_payload JSONB,
    lead_time_months NUMERIC(4, 2),
    action_taken_by VARCHAR(128),
    action_notes TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recommendations (
    id SERIAL PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    priority INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    action_description TEXT NOT NULL,
    owner_department VARCHAR(128) NOT NULL,
    expected_benefit TEXT NOT NULL,
    urgency_level VARCHAR(32) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Project Actions & History
CREATE TABLE IF NOT EXISTS project_actions (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    assigned_to VARCHAR(128) NOT NULL,
    assigned_role VARCHAR(64) NOT NULL,
    assigned_by VARCHAR(128) NOT NULL,
    priority VARCHAR(16) NOT NULL DEFAULT 'HIGH',
    status VARCHAR(32) NOT NULL DEFAULT 'ACTION_ASSIGNED',
    target_completion_date VARCHAR(32),
    progress_notes TEXT,
    evidence_urls JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS action_status_history (
    id BIGSERIAL PRIMARY KEY,
    action_id VARCHAR(64) REFERENCES project_actions(id) ON DELETE CASCADE,
    previous_status VARCHAR(32) NOT NULL,
    new_status VARCHAR(32) NOT NULL,
    updated_by_user_id VARCHAR(64) REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Role-Aware Notifications & Security Audit Trail
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(64) PRIMARY KEY,
    type VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    target_roles JSONB NOT NULL,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    project_id VARCHAR(64) REFERENCES projects(id) ON DELETE CASCADE,
    severity VARCHAR(16) NOT NULL DEFAULT 'INFO',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(64),
    user_role VARCHAR(64),
    action VARCHAR(128) NOT NULL,
    resource_type VARCHAR(64) NOT NULL,
    resource_id VARCHAR(64),
    ip_address VARCHAR(45),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
