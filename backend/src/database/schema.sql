-- ==============================================================================
-- PAIMANA PREDICT — PRODUCTION RELATIONAL DATABASE SCHEMA (PostgreSQL)
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

-- 2. Core Projects Master Table
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(64) PRIMARY KEY, -- e.g. 'PAI-706775'
    project_code VARCHAR(32) UNIQUE NOT NULL, -- e.g. '706775'
    project_name VARCHAR(512) NOT NULL,
    ministry_id INTEGER REFERENCES ministries(id) ON DELETE RESTRICT,
    sector_id INTEGER REFERENCES sectors(id) ON DELETE RESTRICT,
    state_id INTEGER REFERENCES states(id) ON DELETE SET NULL,
    agency_id INTEGER REFERENCES agencies(id) ON DELETE SET NULL,
    
    -- Current Status & Financial Baseline (₹ Crores)
    original_cost NUMERIC(15, 2) NOT NULL,
    revised_cost NUMERIC(15, 2) NOT NULL,
    cumulative_expenditure NUMERIC(15, 2) NOT NULL DEFAULT 0.0,
    cost_overrun_cr NUMERIC(15, 2) GENERATED ALWAYS AS (GREATEST(0, revised_cost - original_cost)) STORED,
    cost_growth_pct NUMERIC(8, 2) GENERATED ALWAYS AS (
        CASE WHEN original_cost > 0 THEN ROUND(((revised_cost - original_cost) / original_cost) * 100.0, 2) ELSE 0 END
    ) STORED,
    expenditure_ratio_pct NUMERIC(8, 2) GENERATED ALWAYS AS (
        CASE WHEN revised_cost > 0 THEN ROUND((cumulative_expenditure / revised_cost) * 100.0, 2) ELSE 0 END
    ) STORED,
    
    -- Schedule Milestones
    approval_date VARCHAR(32),
    start_date VARCHAR(32),
    target_completion_date VARCHAR(32),
    revised_completion_date VARCHAR(32),
    schedule_extension_months INTEGER DEFAULT 0,
    is_schedule_extended BOOLEAN DEFAULT FALSE,
    is_cost_escalated BOOLEAN DEFAULT FALSE,
    physical_progress NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    status VARCHAR(32) NOT NULL DEFAULT 'ONGOING', -- 'ONGOING', 'COMPLETED', 'STALLED'
    
    -- Cross-Reference Identifiers
    legacy_ocms_code VARCHAR(64),
    pmgid VARCHAR(64),
    
    -- Telemetry & Audit Metadata
    first_observed_snapshot VARCHAR(32), -- e.g. '2025-10'
    last_observed_snapshot VARCHAR(32),  -- e.g. '2026-04'
    snapshot_count INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for high-performance filtering & lookups
CREATE INDEX IF NOT EXISTS idx_projects_code ON projects(project_code);
CREATE INDEX IF NOT EXISTS idx_projects_ministry ON projects(ministry_id);
CREATE INDEX IF NOT EXISTS idx_projects_sector ON projects(sector_id);
CREATE INDEX IF NOT EXISTS idx_projects_state ON projects(state_id);
CREATE INDEX IF NOT EXISTS idx_projects_cost_growth ON projects(cost_growth_pct DESC);
CREATE INDEX IF NOT EXISTS idx_projects_progress ON projects(physical_progress);

-- 3. Project Historical Snapshots (One-to-Many Time Series)
CREATE TABLE IF NOT EXISTS project_snapshots (
    id BIGSERIAL PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    report_period VARCHAR(32) NOT NULL, -- e.g. 'April 2026'
    report_date_key VARCHAR(16) NOT NULL, -- e.g. '2026-04' (Strict ISO Sorting Key)
    source_document VARCHAR(128) NOT NULL, -- e.g. 'FlashReport_April2026.pdf'
    source_table VARCHAR(64) NOT NULL, -- e.g. 'Table 6'
    
    -- Extracted Snapshot Values
    original_cost NUMERIC(15, 2) NOT NULL,
    revised_cost NUMERIC(15, 2) NOT NULL,
    cumulative_expenditure NUMERIC(15, 2) NOT NULL,
    physical_progress NUMERIC(5, 2) NOT NULL,
    target_completion_date VARCHAR(32),
    revised_completion_date VARCHAR(32),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_project_snapshot UNIQUE (project_id, report_date_key)
);

CREATE INDEX IF NOT EXISTS idx_snapshots_project ON project_snapshots(project_id);
CREATE INDEX IF NOT EXISTS idx_snapshots_date_key ON project_snapshots(report_date_key);

-- 4. Ingestion Runs & Reconciliation Audit Logs
CREATE TABLE IF NOT EXISTS ingestion_runs (
    id SERIAL PRIMARY KEY,
    report_period VARCHAR(32) NOT NULL,
    source_filename VARCHAR(255) NOT NULL,
    extracted_projects_count INTEGER NOT NULL,
    total_original_cost_cr NUMERIC(15, 2) NOT NULL,
    total_revised_cost_cr NUMERIC(15, 2) NOT NULL,
    total_expenditure_cr NUMERIC(15, 2) NOT NULL,
    reconciliation_status VARCHAR(16) NOT NULL, -- 'PASS', 'FAIL'
    original_cost_diff_pct NUMERIC(6, 4) NOT NULL,
    revised_cost_diff_pct NUMERIC(6, 4) NOT NULL,
    expenditure_diff_pct NUMERIC(6, 4) NOT NULL,
    sha256_checksum VARCHAR(64),
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Machine Learning Model Registry & Artifacts
CREATE TABLE IF NOT EXISTS model_registry (
    id SERIAL PRIMARY KEY,
    model_name VARCHAR(128) NOT NULL,
    version VARCHAR(32) NOT NULL, -- e.g. 'v1.0.0-gbm'
    algorithm VARCHAR(64) NOT NULL, -- 'GradientBoostingClassifier', 'RandomForestClassifier'
    target_variable VARCHAR(64) NOT NULL, -- 'time_overrun_gt_3mo', 'cost_overrun_gt_10pct'
    feature_set JSONB NOT NULL,
    training_sample_count INTEGER NOT NULL,
    validation_strategy VARCHAR(128) NOT NULL, -- '5-Fold Stratified Cross Validation'
    
    -- Validated Metrics
    roc_auc NUMERIC(5, 4) NOT NULL,
    precision_score NUMERIC(5, 4) NOT NULL,
    recall_score NUMERIC(5, 4) NOT NULL,
    f1_score NUMERIC(5, 4) NOT NULL,
    accuracy_score NUMERIC(5, 4) NOT NULL,
    brier_calibration_score NUMERIC(5, 4) NOT NULL,
    early_warning_lead_months NUMERIC(4, 2) NOT NULL,
    
    is_active_production BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Model Predictions & Inferences (Temporal Log)
CREATE TABLE IF NOT EXISTS project_predictions (
    id BIGSERIAL PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    model_id INTEGER REFERENCES model_registry(id) ON DELETE RESTRICT,
    snapshot_date_key VARCHAR(16) NOT NULL, -- Observation cutoff (Strict Anti-Leakage T)
    
    predicted_delay_months INTEGER NOT NULL,
    delay_probability NUMERIC(5, 2) NOT NULL,
    cost_exposure_cr NUMERIC(15, 2) NOT NULL,
    cost_overrun_probability NUMERIC(5, 2) NOT NULL,
    risk_level VARCHAR(16) NOT NULL, -- 'LOW', 'MODERATE', 'HIGH', 'CRITICAL'
    confidence_score NUMERIC(5, 2) NOT NULL,
    
    feature_contributions JSONB, -- Shapley / Gini breakdown
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Early Warning Signals & Watchlists
CREATE TABLE IF NOT EXISTS early_warnings (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    alert_type VARCHAR(64) NOT NULL, -- 'HISTORICAL_SIGNAL', 'PROGRESS_STAGNATION', 'COST_ESCALATION'
    severity VARCHAR(16) NOT NULL, -- 'CRITICAL', 'HIGH', 'MODERATE'
    status VARCHAR(32) NOT NULL DEFAULT 'DETECTED', -- 'DETECTED', 'REVIEWED', 'ACTION_INITIATED', 'RESOLVED'
    trigger_reason TEXT NOT NULL,
    evidence_payload JSONB,
    lead_time_months NUMERIC(4, 2),
    action_taken_by VARCHAR(128),
    action_notes TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Prescriptive Decision Recommendations
CREATE TABLE IF NOT EXISTS recommendations (
    id SERIAL PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    priority INTEGER NOT NULL, -- 1 (Immediate), 2 (Medium), 3 (Long-term)
    title VARCHAR(255) NOT NULL,
    action_description TEXT NOT NULL,
    owner_department VARCHAR(128) NOT NULL,
    expected_benefit TEXT NOT NULL,
    urgency_level VARCHAR(32) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. System & Security Audit Trail
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(64),
    user_role VARCHAR(64),
    action VARCHAR(128) NOT NULL, -- 'QUERY_PROJECT', 'STATUS_CHANGE', 'EXPORT_BRIEF'
    resource_type VARCHAR(64) NOT NULL,
    resource_id VARCHAR(64),
    ip_address VARCHAR(45),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
