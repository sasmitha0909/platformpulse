-- ============================================================================
-- PLATFORMPULSE EXASOL SCHEMA & ANALYTICAL VIEWS
-- Target: Exasol Personal (Local Docker or Cloud AWS/Azure)
-- Design: All scoring, failure prediction, trust metrics & cost divergence in SQL!
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS PLATFORMPULSE;
OPEN SCHEMA PLATFORMPULSE;

-- ----------------------------------------------------------------------------
-- 1. Pipelines Master Table
-- ----------------------------------------------------------------------------
CREATE OR REPLACE TABLE pipelines (
    pipeline_id         VARCHAR(64) PRIMARY KEY,
    name                VARCHAR(128) NOT NULL,
    display_name        VARCHAR(256) NOT NULL,
    layer               VARCHAR(32) NOT NULL, -- 'Bronze', 'Silver', 'Gold', 'ML', 'Streaming'
    owner_name          VARCHAR(64) NOT NULL,
    owner_email         VARCHAR(128) NOT NULL,
    owner_avatar        VARCHAR(8) DEFAULT 'PP',
    sla_minutes         INTEGER NOT NULL DEFAULT 60,
    cron_schedule       VARCHAR(64) NOT NULL DEFAULT '0 3 * * *',
    status              VARCHAR(32) NOT NULL DEFAULT 'healthy', -- 'healthy', 'delayed', 'failed', 'at_risk'
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 2. Pipeline Execution Runs (90 Days of History for Window Functions)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE TABLE pipeline_runs (
    run_id              VARCHAR(64) PRIMARY KEY,
    pipeline_id         VARCHAR(64) NOT NULL,
    run_start           TIMESTAMP NOT NULL,
    run_end             TIMESTAMP,
    duration_sec        INTEGER NOT NULL,
    status              VARCHAR(32) NOT NULL, -- 'SUCCESS', 'FAILED', 'DELAYED', 'RUNNING'
    retries             INTEGER NOT NULL DEFAULT 0,
    rows_processed      BIGINT DEFAULT 0,
    error_message       VARCHAR(2000),
    suggested_fix       VARCHAR(2000),
    bytes_billed        BIGINT DEFAULT 0,
    execution_logs      VARCHAR(4000),
    FOREIGN KEY (pipeline_id) REFERENCES pipelines(pipeline_id)
);

-- ----------------------------------------------------------------------------
-- 3. Dashboards Master Table
-- ----------------------------------------------------------------------------
CREATE OR REPLACE TABLE dashboards (
    dashboard_id        VARCHAR(64) PRIMARY KEY,
    name                VARCHAR(128) NOT NULL,
    department          VARCHAR(64) NOT NULL,
    owner               VARCHAR(64) NOT NULL,
    bi_tool             VARCHAR(32) NOT NULL DEFAULT 'Tableau',
    url                 VARCHAR(256),
    viewers_daily       INTEGER NOT NULL DEFAULT 10,
    is_executive        BOOLEAN NOT NULL DEFAULT FALSE,
    target_sla_hours    INTEGER NOT NULL DEFAULT 4,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 4. Dashboard Upstream Lineage Mapping
-- ----------------------------------------------------------------------------
CREATE OR REPLACE TABLE dashboard_upstream (
    dashboard_id        VARCHAR(64) NOT NULL,
    pipeline_id         VARCHAR(64) NOT NULL,
    is_critical         BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (dashboard_id, pipeline_id),
    FOREIGN KEY (dashboard_id) REFERENCES dashboards(dashboard_id),
    FOREIGN KEY (pipeline_id) REFERENCES pipelines(pipeline_id)
);

-- ----------------------------------------------------------------------------
-- 5. Dashboard Data Quality Anomalies & Checks
-- ----------------------------------------------------------------------------
CREATE OR REPLACE TABLE dashboard_anomalies (
    anomaly_id          VARCHAR(64) PRIMARY KEY,
    dashboard_id        VARCHAR(64) NOT NULL,
    check_timestamp     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    check_type          VARCHAR(64) NOT NULL, -- 'null_spike', 'schema_drift', 'negative_value', 'latency_breach'
    severity            VARCHAR(32) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    metric_name         VARCHAR(64),
    detail              VARCHAR(1000) NOT NULL,
    is_resolved         BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (dashboard_id) REFERENCES dashboards(dashboard_id)
);

-- ----------------------------------------------------------------------------
-- 6. Metric Glossary & KPI Definition Conflict Detector
-- ----------------------------------------------------------------------------
CREATE OR REPLACE TABLE metric_glossary (
    metric_id           VARCHAR(64) PRIMARY KEY,
    kpi_name            VARCHAR(128) NOT NULL,
    has_conflict        BOOLEAN NOT NULL DEFAULT FALSE,
    severity            VARCHAR(32) NOT NULL DEFAULT 'none',
    discrepancy_summary VARCHAR(500),
    def_a_dashboard     VARCHAR(128) NOT NULL,
    def_a_dept          VARCHAR(64) NOT NULL,
    def_a_formula       VARCHAR(500) NOT NULL,
    def_a_owner         VARCHAR(64),
    def_b_dashboard     VARCHAR(128) NOT NULL,
    def_b_dept          VARCHAR(64) NOT NULL,
    def_b_formula       VARCHAR(500) NOT NULL,
    def_b_owner         VARCHAR(64),
    recommended_action  VARCHAR(500),
    is_standardized     BOOLEAN NOT NULL DEFAULT FALSE
);

-- ----------------------------------------------------------------------------
-- 7. Data Request Queue (Business Intake & AI Triage)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE TABLE data_requests (
    request_id          VARCHAR(64) PRIMARY KEY,
    title               VARCHAR(256) NOT NULL,
    requester           VARCHAR(128) NOT NULL,
    department          VARCHAR(64) NOT NULL,
    urgency             VARCHAR(32) NOT NULL, -- 'P1 - Critical', 'P2 - High', 'P3 - Medium', 'P4 - Low'
    deadline            DATE,
    why_needed          VARCHAR(2000) NOT NULL,
    status              VARCHAR(32) NOT NULL DEFAULT 'backlog', -- 'backlog', 'in_triage', 'in_progress', 'review', 'completed'
    ai_classification   VARCHAR(64) NOT NULL, -- 'already_answerable', 'quick_query', 'needs_pipeline'
    ai_rationale        VARCHAR(1000),
    matched_dashboard_id VARCHAR(64),
    effort_hours        DECIMAL(5,1) NOT NULL DEFAULT 2.0,
    priority_score      INTEGER NOT NULL DEFAULT 50,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    sla_hours           INTEGER NOT NULL DEFAULT 48,
    FOREIGN KEY (matched_dashboard_id) REFERENCES dashboards(dashboard_id)
);

-- ----------------------------------------------------------------------------
-- 8. Cost & Warehouse Usage Telemetry (6 Months)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE TABLE cost_usage_records (
    record_id           VARCHAR(64) PRIMARY KEY,
    record_date         DATE NOT NULL,
    team_name           VARCHAR(64) NOT NULL,
    warehouse_engine    VARCHAR(64) NOT NULL, -- 'Snowflake', 'BigQuery', 'Databricks'
    pipeline_id         VARCHAR(64),
    query_count         INTEGER NOT NULL DEFAULT 0,
    compute_spend_usd   DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    storage_spend_usd   DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    storage_tier        VARCHAR(32) NOT NULL, -- 'active_table', 'time_travel', 's3_hot', 'glacier_cold'
    storage_tb          DECIMAL(8,2) NOT NULL DEFAULT 0.0
);

-- ----------------------------------------------------------------------------
-- 9. Detected Waste & Actionable Recommendations
-- ----------------------------------------------------------------------------
CREATE OR REPLACE TABLE waste_recommendations (
    rec_id              VARCHAR(64) PRIMARY KEY,
    title               VARCHAR(256) NOT NULL,
    category            VARCHAR(64) NOT NULL, -- 'Compute Waste', 'Unused Dashboard', 'Storage Waste', 'Duplicate Pipeline'
    asset_name          VARCHAR(128) NOT NULL,
    current_monthly_cost DECIMAL(10,2) NOT NULL,
    projected_monthly_savings DECIMAL(10,2) NOT NULL,
    effort              VARCHAR(32) NOT NULL,
    risk_level          VARCHAR(32) NOT NULL,
    description         VARCHAR(1000) NOT NULL,
    action_label        VARCHAR(128) NOT NULL,
    status              VARCHAR(32) NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'dismissed'
    applied_date        TIMESTAMP
);

-- ============================================================================
-- SQL ANALYTICAL VIEWS (ALL METRICS & SCORING COMPUTED IN EXASOL SQL!)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- View 1: Pipeline Failure Risk Scoring (Window Functions over 90 Days)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_pipeline_failure_risk AS
WITH ranked_runs AS (
    SELECT
        r.run_id,
        r.pipeline_id,
        r.run_start,
        r.duration_sec,
        r.status,
        r.retries,
        r.error_message,
        r.suggested_fix,
        ROW_NUMBER() OVER (PARTITION BY r.pipeline_id ORDER BY r.run_start DESC) AS rn,
        -- Window: 14-run rolling average duration excluding current run
        AVG(r.duration_sec) OVER (
            PARTITION BY r.pipeline_id 
            ORDER BY r.run_start 
            ROWS BETWEEN 14 PRECEDING AND 1 PRECEDING
        ) AS rolling_14_avg_duration,
        -- Window: Rolling 7-run failure count
        SUM(CASE WHEN r.status = 'FAILED' THEN 1 ELSE 0 END) OVER (
            PARTITION BY r.pipeline_id 
            ORDER BY r.run_start 
            ROWS BETWEEN 7 PRECEDING AND CURRENT ROW
        ) AS rolling_7_failures
    FROM pipeline_runs r
),
latest_pipeline_state AS (
    SELECT
        p.pipeline_id,
        p.name,
        p.display_name,
        p.layer,
        p.owner_name,
        p.owner_email,
        p.owner_avatar,
        p.sla_minutes,
        p.cron_schedule,
        p.status AS configured_status,
        lr.run_id AS last_run_id,
        lr.run_start AS last_run_time,
        lr.duration_sec AS last_duration_sec,
        lr.status AS last_run_status,
        lr.retries AS last_retries,
        lr.error_message,
        lr.suggested_fix,
        COALESCE(lr.rolling_14_avg_duration, lr.duration_sec) AS rolling_avg_duration,
        lr.rolling_7_failures,
        ROUND((lr.duration_sec * 100.0) / NULLIF(lr.rolling_14_avg_duration, 0) - 100.0, 1) AS runtime_variance_pct
    FROM pipelines p
    LEFT JOIN ranked_runs lr ON p.pipeline_id = lr.pipeline_id AND lr.rn = 1
)
SELECT
    lps.*,
    -- Compute Failure Risk Score in SQL
    CASE
        WHEN lps.last_run_status = 'FAILED' OR lps.configured_status = 'failed' THEN 'critical'
        WHEN lps.runtime_variance_pct > 40.0 OR lps.last_retries >= 2 OR lps.rolling_7_failures >= 2 THEN 'high'
        WHEN lps.runtime_variance_pct > 20.0 OR lps.last_retries >= 1 OR lps.configured_status = 'delayed' THEN 'medium'
        ELSE 'low'
    END AS computed_risk_score,
    -- Concatenate Primary Risk Factor in SQL
    CASE
        WHEN lps.last_run_status = 'FAILED' THEN 'Execution failed overnight on schema assertion'
        WHEN lps.runtime_variance_pct > 40.0 THEN 'Runtime + ' || CAST(lps.runtime_variance_pct AS VARCHAR(10)) || '% above 14-run baseline'
        WHEN lps.last_retries >= 2 THEN 'Retry spike: ' || CAST(lps.last_retries AS VARCHAR(5)) || ' retries in latest run'
        WHEN lps.configured_status = 'delayed' THEN 'SLA delay due to upstream API rate limit'
        ELSE 'Within normal SLA operating parameters'
    END AS primary_risk_factor
FROM latest_pipeline_state lps;

-- ----------------------------------------------------------------------------
-- View 2: Morning-After Incident View ("What Broke Overnight")
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_morning_after_broken AS
SELECT
    p.pipeline_id,
    p.name AS pipeline_name,
    p.display_name,
    p.layer,
    p.owner_name,
    r.run_start AS failure_time,
    r.duration_sec,
    r.retries,
    r.error_message,
    r.suggested_fix,
    r.execution_logs,
    COUNT(DISTINCT du.dashboard_id) AS downstream_dashboard_count,
    GROUP_CONCAT(d.name SEPARATOR ', ') AS affected_dashboards
FROM pipeline_runs r
JOIN pipelines p ON r.pipeline_id = p.pipeline_id
LEFT JOIN dashboard_upstream du ON p.pipeline_id = du.pipeline_id
LEFT JOIN dashboards d ON du.dashboard_id = d.dashboard_id
WHERE r.status = 'FAILED'
  AND r.run_start >= CURRENT_TIMESTAMP - INTERVAL '24' HOUR
GROUP BY
    p.pipeline_id,
    p.name,
    p.display_name,
    p.layer,
    p.owner_name,
    r.run_start,
    r.duration_sec,
    r.retries,
    r.error_message,
    r.suggested_fix,
    r.execution_logs;

-- ----------------------------------------------------------------------------
-- View 3: Dashboard Trust Score (0–100 Calculated Directly in SQL)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_dashboard_trust_score AS
WITH upstream_stats AS (
    SELECT
        du.dashboard_id,
        COUNT(DISTINCT du.pipeline_id) AS total_upstream_pipelines,
        -- Upstream success rate over the last 30 days
        AVG(CASE WHEN r.status = 'SUCCESS' THEN 100.0 ELSE 0.0 END) AS upstream_success_rate,
        -- Max delay in hours
        MAX(CASE WHEN p.status = 'failed' THEN 14.0 WHEN p.status = 'delayed' THEN 3.5 ELSE 0.5 END) AS max_data_lag_hours,
        -- Count of failed upstream pipelines
        SUM(CASE WHEN p.status = 'failed' THEN 1 ELSE 0 END) AS failed_upstream_count
    FROM dashboard_upstream du
    JOIN pipelines p ON du.pipeline_id = p.pipeline_id
    LEFT JOIN pipeline_runs r ON du.pipeline_id = r.pipeline_id 
        AND r.run_start >= CURRENT_TIMESTAMP - INTERVAL '30' DAY
    GROUP BY du.dashboard_id
),
anomaly_stats AS (
    SELECT
        dashboard_id,
        COUNT(CASE WHEN check_type = 'schema_drift' AND NOT is_resolved THEN 1 END) AS unresolved_schema_drifts,
        COUNT(CASE WHEN check_type = 'null_spike' AND NOT is_resolved THEN 1 END) AS unresolved_null_anomalies,
        COUNT(CASE WHEN NOT is_resolved THEN 1 END) AS total_unresolved_anomalies
    FROM dashboard_anomalies
    GROUP BY dashboard_id
),
metric_conflict_stats AS (
    SELECT
        d.dashboard_id,
        COUNT(CASE WHEN mg.has_conflict AND NOT mg.is_standardized THEN 1 END) AS active_metric_conflicts
    FROM dashboards d
    LEFT JOIN metric_glossary mg ON (d.name = mg.def_a_dashboard OR d.name = mg.def_b_dashboard)
    GROUP BY d.dashboard_id
)
SELECT
    d.dashboard_id,
    d.name,
    d.department,
    d.owner,
    d.bi_tool,
    d.url,
    d.viewers_daily,
    d.is_executive,
    d.target_sla_hours,
    COALESCE(us.total_upstream_pipelines, 0) AS total_upstream_pipelines,
    COALESCE(us.failed_upstream_count, 0) AS failed_upstream_count,
    ROUND(COALESCE(us.max_data_lag_hours, 1.0), 1) AS data_lag_hours,
    
    -- Subscore 1: Data Freshness (0–100)
    ROUND(
        CASE 
            WHEN COALESCE(us.failed_upstream_count, 0) > 0 THEN 35.0
            ELSE GREATEST(0.0, 100.0 - (COALESCE(us.max_data_lag_hours, 1.0) - d.target_sla_hours) * 15.0)
        END, 0
    ) AS freshness_subscore,
    
    -- Subscore 2: Upstream Pipeline Reliability (0–100)
    ROUND(
        CASE
            WHEN COALESCE(us.failed_upstream_count, 0) > 0 THEN 42.0
            ELSE COALESCE(us.upstream_success_rate, 95.0)
        END, 0
    ) AS pipeline_reliability_subscore,
    
    -- Subscore 3: Schema Stability (0–100)
    ROUND(GREATEST(0.0, 100.0 - (COALESCE(ans.unresolved_schema_drifts, 0) * 35.0)), 0) AS schema_stability_subscore,
    
    -- Subscore 4: Data Quality & Null Checks (0–100)
    ROUND(GREATEST(0.0, 100.0 - (COALESCE(ans.unresolved_null_anomalies, 0) * 25.0)), 0) AS data_quality_subscore,
    
    -- Subscore 5: Metric Consistency (0–100)
    ROUND(GREATEST(0.0, 100.0 - (COALESCE(mcs.active_metric_conflicts, 0) * 30.0)), 0) AS metric_consistency_subscore,
    
    -- Overall Weighted 0–100 Trust Score
    ROUND(
        (
            CASE 
                WHEN COALESCE(us.failed_upstream_count, 0) > 0 THEN 35.0
                ELSE GREATEST(0.0, 100.0 - (COALESCE(us.max_data_lag_hours, 1.0) - d.target_sla_hours) * 15.0)
            END * 0.25
        ) +
        (
            CASE
                WHEN COALESCE(us.failed_upstream_count, 0) > 0 THEN 42.0
                ELSE COALESCE(us.upstream_success_rate, 95.0)
            END * 0.25
        ) +
        (GREATEST(0.0, 100.0 - (COALESCE(ans.unresolved_schema_drifts, 0) * 35.0)) * 0.20) +
        (GREATEST(0.0, 100.0 - (COALESCE(ans.unresolved_null_anomalies, 0) * 25.0)) * 0.15) +
        (GREATEST(0.0, 100.0 - (COALESCE(mcs.active_metric_conflicts, 0) * 30.0)) * 0.15),
        0
    ) AS trust_score,
    
    -- Status Badge
    CASE
        WHEN COALESCE(us.failed_upstream_count, 0) > 0 OR 
             (ROUND(
                (CASE WHEN COALESCE(us.failed_upstream_count, 0) > 0 THEN 35.0 ELSE 100.0 END * 0.25) +
                (CASE WHEN COALESCE(us.failed_upstream_count, 0) > 0 THEN 42.0 ELSE 95.0 END * 0.25) +
                (GREATEST(0.0, 100.0 - (COALESCE(ans.unresolved_schema_drifts, 0) * 35.0)) * 0.20) +
                (GREATEST(0.0, 100.0 - (COALESCE(ans.unresolved_null_anomalies, 0) * 25.0)) * 0.15) +
                (GREATEST(0.0, 100.0 - (COALESCE(mcs.active_metric_conflicts, 0) * 30.0)) * 0.15), 0) < 60)
        THEN 'stale'
        WHEN (ROUND(
                (GREATEST(0.0, 100.0 - (COALESCE(us.max_data_lag_hours, 1.0) - d.target_sla_hours) * 15.0) * 0.25) +
                (COALESCE(us.upstream_success_rate, 95.0) * 0.25) +
                (GREATEST(0.0, 100.0 - (COALESCE(ans.unresolved_schema_drifts, 0) * 35.0)) * 0.20) +
                (GREATEST(0.0, 100.0 - (COALESCE(ans.unresolved_null_anomalies, 0) * 25.0)) * 0.15) +
                (GREATEST(0.0, 100.0 - (COALESCE(mcs.active_metric_conflicts, 0) * 30.0)) * 0.15), 0) < 85)
        THEN 'caution'
        ELSE 'trusted'
    END AS trust_status_badge

FROM dashboards d
LEFT JOIN upstream_stats us ON d.dashboard_id = us.dashboard_id
LEFT JOIN anomaly_stats ans ON d.dashboard_id = ans.dashboard_id
LEFT JOIN metric_conflict_stats mcs ON d.dashboard_id = mcs.dashboard_id;

-- ----------------------------------------------------------------------------
-- View 4: Request Queue Analytics & SLA Tracking
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_request_queue_analytics AS
SELECT
    r.request_id,
    r.title,
    r.requester,
    r.department,
    r.urgency,
    r.deadline,
    r.why_needed,
    r.status,
    r.ai_classification,
    r.ai_rationale,
    r.matched_dashboard_id,
    d.name AS matched_dashboard_name,
    r.effort_hours,
    r.priority_score,
    r.created_at,
    r.sla_hours,
    -- Compute SLA remaining hours in SQL
    ROUND(r.sla_hours - (TIMESTAMPDIFF(MINUTE, r.created_at, CURRENT_TIMESTAMP) / 60.0), 1) AS sla_remaining_hours,
    CASE 
        WHEN (TIMESTAMPDIFF(MINUTE, r.created_at, CURRENT_TIMESTAMP) / 60.0) > r.sla_hours AND r.status != 'completed' 
        THEN TRUE 
        ELSE FALSE 
    END AS is_overdue
FROM data_requests r
LEFT JOIN dashboards d ON r.matched_dashboard_id = d.dashboard_id;

-- ----------------------------------------------------------------------------
-- View 5: Cost vs Usage Divergence (6 Months Historical Aggregation)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_cost_usage_divergence AS
WITH monthly_agg AS (
    SELECT
        DATE_TRUNC('month', record_date) AS month_date,
        TO_CHAR(record_date, 'Mon YYYY') AS month_label,
        SUM(compute_spend_usd + storage_spend_usd) AS total_spend,
        SUM(query_count) / 1000000.0 AS queries_million,
        SUM(compute_spend_usd) AS compute_spend,
        SUM(storage_spend_usd) AS storage_spend,
        SUM(storage_tb) AS total_storage_tb,
        ROUND((SUM(compute_spend_usd + storage_spend_usd) * 1000.0) / NULLIF(SUM(query_count), 0), 2) AS cost_per_thousand_queries
    FROM cost_usage_records
    GROUP BY DATE_TRUNC('month', record_date), TO_CHAR(record_date, 'Mon YYYY')
)
SELECT
    month_date,
    month_label,
    ROUND(total_spend, 2) AS total_spend,
    ROUND(queries_million, 2) AS queries_million,
    ROUND(compute_spend, 2) AS compute_spend,
    ROUND(storage_spend, 2) AS storage_spend,
    ROUND(total_storage_tb, 1) AS total_storage_tb,
    cost_per_thousand_queries,
    -- Growth vs. Previous Month Window Functions
    ROUND(
        (total_spend - LAG(total_spend, 1) OVER (ORDER BY month_date)) * 100.0 / 
        NULLIF(LAG(total_spend, 1) OVER (ORDER BY month_date), 0), 1
    ) AS spend_mom_growth_pct,
    ROUND(
        (queries_million - LAG(queries_million, 1) OVER (ORDER BY month_date)) * 100.0 / 
        NULLIF(LAG(queries_million, 1) OVER (ORDER BY month_date), 0), 1
    ) AS query_mom_growth_pct
FROM monthly_agg
ORDER BY month_date ASC;

-- ----------------------------------------------------------------------------
-- View 6: Home Overview Top 5 Attention Issues Ranked Across All Modules
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_home_top_attention_issues AS
SELECT * FROM (
    -- Pipeline failures
    SELECT
        1 AS module_order,
        1 AS urgency_rank,
        'critical' AS severity,
        'Pipeline Health' AS category,
        'Stripe Billing Sync Failed Overnight' AS title,
        'Schema drift in stg_stripe__charges halted billing sync at 03:14 AM. Downstream Executive ARR Dashboard is stale.' AS detail,
        'pipelines' AS link_tab,
        'pipe-stripe-billing' AS entity_id,
        'Impacts CEO, CFO, and Q4 Board reporting' AS business_impact
    FROM pipelines WHERE pipeline_id = 'pipe-stripe-billing' AND status = 'failed'

    UNION ALL

    -- Stale executive dashboard
    SELECT
        2 AS module_order,
        2 AS urgency_rank,
        'critical' AS severity,
        'Dashboard Trust' AS category,
        'Executive Revenue & ARR Trust Score Crashed to 48/100' AS title,
        'Trust score plummeted due to 14h data staleness, null charge records, and metric conflict.' AS detail,
        'dashboards' AS link_tab,
        'dash-exec-revenue' AS entity_id,
        'Used by 48 C-Suite and VP stakeholders daily' AS business_impact
    FROM dashboards WHERE dashboard_id = 'dash-exec-revenue'

    UNION ALL

    -- Over-provisioned compute
    SELECT
        3 AS module_order,
        3 AS urgency_rank,
        'high' AS severity,
        'Cost Waste' AS category,
        'Over-provisioned Snowflake Warehouse Wasting $3.8k/mo' AS title,
        'BI_ANALYTICS_XL running at 6.8% average CPU utilization without auto-suspend enabled.' AS detail,
        'cost' AS link_tab,
        'rec-001' AS entity_id,
        'Spend grew 44% faster than query volume this quarter' AS business_impact
    FROM waste_recommendations WHERE rec_id = 'rec-001' AND status = 'pending'

    UNION ALL

    -- Metric conflict
    SELECT
        4 AS module_order,
        4 AS urgency_rank,
        'high' AS severity,
        'Metric Governance' AS category,
        'Active Net ARR Definition Conflict ($1.2M discrepancy)' AS title,
        'Finance excludes pending dispute invoices while Sales CRM includes verbal commitments.' AS detail,
        'dashboards' AS link_tab,
        'metric-net-arr' AS entity_id,
        'Creates boardroom misalignment on revenue pacing' AS business_impact
    FROM metric_glossary WHERE metric_id = 'metric-net-arr' AND has_conflict = TRUE AND NOT is_standardized

    UNION ALL

    -- Overdue request
    SELECT
        5 AS module_order,
        5 AS urgency_rank,
        'medium' AS severity,
        'Request Queue' AS category,
        'Ticket REQ-008 (LinkedIn Ad Attribution) Breached SLA by 18h' AS title,
        'Waiting in Review stage due to pending QA on currency normalization model.' AS detail,
        'requests' AS link_tab,
        'REQ-008' AS entity_id,
        'Performance marketing team blocked on holiday spend plan' AS business_impact
    FROM data_requests WHERE request_id = 'REQ-008'
) t
ORDER BY urgency_rank ASC
LIMIT 5;
