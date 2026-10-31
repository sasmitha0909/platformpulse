"""
PlatformPulse Synthetic Data Generator & Exasol Seeder
Generates:
- 16 pipelines with 90 days of runs (~2,500+ records)
- 8 dashboards with upstream lineage and anomaly history
- 4 metric glossary records with semantic discrepancies
- 22 data requests across all Kanban stages with AI classifications
- 6 months of cost & usage records demonstrating divergence
- 4 actionable waste recommendations ($7,820/mo reclaimable)
"""

import os
import sys
import random
from datetime import datetime, timedelta
from database import db, DatabaseManager, LOCAL_DB_PATH

# Set fixed random seed for reproducible hackathon demo storytelling
random.seed(42)

def seed_database():
    print("=" * 70)
    print("[*] SEEDING PLATFORMPULSE EXASOL DATABASE")
    print(f"Engine: {db.get_status()['engine']}")
    print(f"Target: {db.get_status()['dsn']}")
    print("=" * 70)

    # Clean existing data
    tables = [
        "waste_recommendations",
        "cost_usage_records",
        "data_requests",
        "metric_glossary",
        "dashboard_anomalies",
        "dashboard_upstream",
        "dashboards",
        "pipeline_runs",
        "pipelines"
    ]
    for tbl in tables:
        try:
            db.execute(f"DELETE FROM {tbl};")
        except Exception as e:
            pass

    # -------------------------------------------------------------------------
    # 1. Pipelines (16 Pipelines across all layers)
    # -------------------------------------------------------------------------
    pipelines_data = [
        ("pipe-stripe-billing", "pipeline_stripe_billing_sync", "Stripe Billing & Invoicing Sync", "Bronze", "Alex Chen", "alex.c@platformpulse.io", "AC", 120, "0 3 * * *", "failed"),
        ("pipe-salesforce-crm", "pipeline_salesforce_crm_etl", "Salesforce Opportunity & Deals Sync", "Silver", "Maya Patel", "maya.p@platformpulse.io", "MP", 45, "0 */4 * * *", "delayed"),
        ("pipe-snowflake-dbt-gold", "pipeline_snowflake_dbt_gold_marts", "DBT Marts: Fact ARR & Enterprise Cohorts", "Gold", "Alex Chen", "alex.c@platformpulse.io", "AC", 30, "30 4 * * *", "failed"),
        ("pipe-kafka-clickstream", "pipeline_kafka_user_events_stream", "Kafka Real-Time Clickstream Ingestion", "Bronze", "Liam Vance", "liam.v@platformpulse.io", "LV", 5, "Continuous", "healthy"),
        ("pipe-amplitude-events", "pipeline_amplitude_product_clicks", "Amplitude Funnel & Session Modeling", "Silver", "Sarah Jenkins", "sarah.j@platformpulse.io", "SJ", 40, "0 */3 * * *", "healthy"),
        ("pipe-marketing-adspend", "pipeline_marketing_adspend_attribution", "Multi-Channel Ad Spend Attribution", "Silver", "Maya Patel", "maya.p@platformpulse.io", "MP", 60, "0 5 * * *", "at_risk"),
        ("pipe-zendesk-tickets", "pipeline_zendesk_support_tickets", "Zendesk Support & CSAT Ingestion", "Bronze", "David Kim", "david.k@platformpulse.io", "DK", 20, "0 */2 * * *", "healthy"),
        ("pipe-netsuite-recon", "pipeline_netsuite_erp_reconciliation", "NetSuite ERP GL Reconciliation", "Gold", "Alex Chen", "alex.c@platformpulse.io", "AC", 90, "0 2 * * *", "at_risk"),
        ("pipe-workday-hr", "pipeline_hr_workday_headcount", "Workday Org Hierarchy & Headcount", "Bronze", "Elena Rostova", "elena.r@platformpulse.io", "ER", 30, "0 1 * * *", "healthy"),
        ("pipe-inventory-logistics", "pipeline_inventory_warehouse_logistics", "Warehouse Logistics & SKU Stocking", "Silver", "David Kim", "david.k@platformpulse.io", "DK", 45, "0 */6 * * *", "healthy"),
        ("pipe-fraud-ml-features", "pipeline_fraud_ml_feature_store", "ML Fraud Risk Real-Time Feature Store", "ML", "Liam Vance", "liam.v@platformpulse.io", "LV", 15, "*/15 * * * *", "healthy"),
        ("pipe-hubspot-leads", "pipeline_hubspot_lead_scoring", "HubSpot Inbound Lead Scoring & Enriched Data", "Silver", "Sarah Jenkins", "sarah.j@platformpulse.io", "SJ", 30, "0 */4 * * *", "delayed"),
        ("pipe-databricks-churn", "pipeline_databricks_churn_model", "Databricks Customer Churn Predictive Inference", "ML", "Liam Vance", "liam.v@platformpulse.io", "LV", 45, "0 4 * * *", "at_risk"),
        ("pipe-postgres-app-db", "pipeline_postgres_cdc_debezium", "Production PostgreSQL CDC Streaming (Debezium)", "Bronze", "David Kim", "david.k@platformpulse.io", "DK", 5, "Continuous", "healthy"),
        ("pipe-google-analytics4", "pipeline_ga4_web_sessions_sync", "Google Analytics 4 Raw Export Sync", "Bronze", "Maya Patel", "maya.p@platformpulse.io", "MP", 60, "0 2 * * *", "healthy"),
        ("pipe-sentry-error-logs", "pipeline_sentry_frontend_exceptions", "Sentry Frontend Crash & Telemetry Stream", "Bronze", "Liam Vance", "liam.v@platformpulse.io", "LV", 10, "Continuous", "healthy")
    ]

    for p in pipelines_data:
        db.execute("""
            INSERT INTO pipelines (pipeline_id, name, display_name, layer, owner_name, owner_email, owner_avatar, sla_minutes, cron_schedule, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, p)
    print("[+] Loaded " + str(len(pipelines_data)) + " pipelines.")

    # -------------------------------------------------------------------------
    # 2. Pipeline Runs (90 Days of Historical Execution Logs)
    # -------------------------------------------------------------------------
    now = datetime(2026, 10, 31, 8, 0, 0)
    run_records = []
    run_counter = 1

    for p in pipelines_data:
        p_id = p[0]
        base_duration = p[7] * 60 # based on sla_minutes
        if base_duration > 3600:
            base_duration = 2400

        # Generate 90 daily runs
        for day in range(89, -1, -1):
            run_date = now - timedelta(days=day)
            run_time = run_date.replace(hour=3, minute=14, second=0) + timedelta(minutes=random.randint(0, 30))
            
            # Normal run variation (+- 10%)
            duration = int(base_duration * random.uniform(0.85, 1.15))
            status = "SUCCESS"
            retries = 0
            err_msg = None
            fix_msg = None
            logs = f"[{run_time.strftime('%H:%M:%S')}] Ingestion job completed successfully. {random.randint(50000, 200000)} rows loaded."

            # Seed deliberate issues on Day 0 (Today / Overnight)
            if day == 0:
                if p_id == "pipe-stripe-billing":
                    status = "FAILED"
                    duration = int(base_duration * 1.68) # +68% runtime spike
                    retries = 3
                    err_msg = "ValidationError: Column 'billing_country_iso2' not found in target schema 'raw_stripe.invoices'. dbt stage stg_stripe__charges failed."
                    fix_msg = "Apply schema migration patch v2.14 or run 'dbt run --select stg_stripe__charges+ --vars \"allow_null_country: true\"'."
                    logs = "[03:14:02] ERROR: Column 'billing_country_iso2' missing.\n[03:14:15] Retry 3 failed. Process terminated."
                elif p_id == "pipe-snowflake-dbt-gold":
                    status = "FAILED"
                    duration = 1080
                    retries = 2
                    err_msg = "DependencyFailure: Required upstream model 'stg_stripe__charges' is stale (last updated 18 hours ago)."
                    fix_msg = "Resolve upstream Stripe billing sync first, then trigger 'dbt build --select marts.revenue+'."
                    logs = "[04:12:00] FAILED: Upstream model stg_stripe__charges stale. Run aborted."
                elif p_id == "pipe-salesforce-crm":
                    status = "DELAYED"
                    duration = int(base_duration * 1.48)
                    retries = 1
                    err_msg = "API Throttling: Salesforce API rate limit reached 85% threshold. Ingestion delayed by 45 minutes."
                    fix_msg = "Switch incremental extraction from REST query to Salesforce Bulk API 2.0 PK-Chunking."
                    logs = "[05:50:11] Warning: 429 Too Many Requests received from Salesforce API. Backing off 120s."
                elif p_id == "pipe-marketing-adspend":
                    duration = int(base_duration * 1.34)
                    retries = 2
                    err_msg = "API Warning: Meta Graph API v18.0 deprecation on 2026-11-15. 2 retries on Google Ads token refresh."
                    fix_msg = "Migrate OAuth credentials to service account and update Meta API client to v20.0."

            run_records.append((
                f"run-{run_counter:05d}",
                p_id,
                run_time.strftime("%Y-%m-%d %H:%M:%S"),
                (run_time + timedelta(seconds=duration)).strftime("%Y-%m-%d %H:%M:%S"),
                duration,
                status,
                retries,
                random.randint(10000, 500000),
                err_msg,
                fix_msg,
                random.randint(5000000, 50000000),
                logs
            ))
            run_counter += 1

    for r in run_records:
        db.execute("""
            INSERT INTO pipeline_runs (run_id, pipeline_id, run_start, run_end, duration_sec, status, retries, rows_processed, error_message, suggested_fix, bytes_billed, execution_logs)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, r)
    print("[+] Loaded " + str(len(run_records)) + " pipeline execution runs across 90 days.")

    # -------------------------------------------------------------------------
    # 3. Dashboards (8 Core BI Assets)
    # -------------------------------------------------------------------------
    dashboards_data = [
        ("dash-exec-revenue", "Executive Revenue & ARR Overview", "Executive & Finance", "CFO Analytics Office", "Tableau", "https://tableau.internal.company.com/#/views/Executive_ARR_Q4", 48, 1, 2),
        ("dash-sales-quota", "Sales Rep Performance & Quota Attainment", "Sales Operations", "Maya Patel (Sales Ops)", "Looker", "https://looker.internal.company.com/dashboards/184", 92, 0, 4),
        ("dash-product-dau", "Product Daily Active Users & Retention", "Product Growth", "Sarah Jenkins (Product)", "Looker", "https://looker.internal.company.com/dashboards/92", 134, 1, 1),
        ("dash-marketing-roi", "Marketing ROI & Multi-Touch Attribution", "Growth Marketing", "Elena Rostova (Growth)", "Tableau", "https://tableau.internal.company.com/#/views/Marketing_Attribution_2026", 38, 0, 4),
        ("dash-cs-churn", "Customer Success Health & Churn Risk", "Customer Success", "David Kim (Data Eng)", "Metabase", "https://metabase.internal.company.com/dashboard/41", 64, 0, 2),
        ("dash-supply-chain", "Supply Chain & Inventory Turnover", "Logistics & Ops", "Alex Chen (Staff Eng)", "Tableau", "https://tableau.internal.company.com/#/views/Warehouse_Logistics_Realtime", 29, 0, 4),
        ("dash-platform-sla", "Engineering Platform Reliability & Latency", "Platform & Infra", "Liam Vance (Principal Infra)", "Grafana", "https://grafana.internal.company.com/d/platform-sla", 85, 1, 1),
        ("dash-hr-hiring", "HR Headcount & Hiring Velocity", "People Ops", "Elena Rostova (BI Lead)", "Looker", "https://looker.internal.company.com/dashboards/hr-org", 19, 0, 6)
    ]

    for d in dashboards_data:
        db.execute("""
            INSERT INTO dashboards (dashboard_id, name, department, owner, bi_tool, url, viewers_daily, is_executive, target_sla_hours)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, d)
    print("[+] Loaded " + str(len(dashboards_data)) + " dashboards.")

    # -------------------------------------------------------------------------
    # 4. Upstream Lineage Mapping
    # -------------------------------------------------------------------------
    upstream_data = [
        ("dash-exec-revenue", "pipe-stripe-billing", 1),
        ("dash-exec-revenue", "pipe-snowflake-dbt-gold", 1),
        ("dash-exec-revenue", "pipe-netsuite-recon", 1),
        ("dash-sales-quota", "pipe-salesforce-crm", 1),
        ("dash-sales-quota", "pipe-hubspot-leads", 0),
        ("dash-product-dau", "pipe-kafka-clickstream", 1),
        ("dash-product-dau", "pipe-amplitude-events", 1),
        ("dash-product-dau", "pipe-postgres-app-db", 1),
        ("dash-marketing-roi", "pipe-marketing-adspend", 1),
        ("dash-marketing-roi", "pipe-hubspot-leads", 0),
        ("dash-cs-churn", "pipe-zendesk-tickets", 0),
        ("dash-cs-churn", "pipe-databricks-churn", 1),
        ("dash-supply-chain", "pipe-inventory-logistics", 1),
        ("dash-platform-sla", "pipe-kafka-clickstream", 1),
        ("dash-platform-sla", "pipe-fraud-ml-features", 1),
        ("dash-hr-hiring", "pipe-workday-hr", 1)
    ]

    for u in upstream_data:
        db.execute("""
            INSERT INTO dashboard_upstream (dashboard_id, pipeline_id, is_critical)
            VALUES (?, ?, ?)
        """, u)
    print("[+] Loaded " + str(len(upstream_data)) + " upstream lineage edges.")

    # -------------------------------------------------------------------------
    # 5. Dashboard Data Quality Anomalies
    # -------------------------------------------------------------------------
    anomalies_data = [
        ("anom-01", "dash-exec-revenue", "2026-10-31 03:16:00", "null_spike", "high", "billing_country", "14.2% null records detected in billing_country (expected < 0.1%)", 0),
        ("anom-02", "dash-exec-revenue", "2026-10-31 03:16:00", "negative_value", "critical", "amount_due", "Negative subscription charge detected (-$12,400) in enterprise billing tier", 0),
        ("anom-03", "dash-sales-quota", "2026-10-31 06:45:00", "latency_breach", "medium", "sync_freshness", "Salesforce CRM sync delayed by 45 minutes beyond 4h SLA window", 0),
        ("anom-04", "dash-marketing-roi", "2026-10-31 05:00:00", "schema_drift", "medium", "campaign_bid_strategy", "Meta Ads Graph API version upgrade required before Nov 15", 0)
    ]

    for a in anomalies_data:
        db.execute("""
            INSERT INTO dashboard_anomalies (anomaly_id, dashboard_id, check_timestamp, check_type, severity, metric_name, detail, is_resolved)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, a)
    print("[+] Loaded " + str(len(anomalies_data)) + " dashboard anomalies.")

    # -------------------------------------------------------------------------
    # 6. Metric Glossary (KPI Definition Conflicts)
    # -------------------------------------------------------------------------
    glossary_data = [
        (
            "metric-net-arr",
            "Net ARR (Annual Recurring Revenue)",
            1,
            "critical",
            "Finance excludes pending dispute invoices and pilot accounts; Sales CRM counts any signed contract regardless of billing status ($1.2M discrepancy).",
            "Executive Revenue & ARR Overview",
            "Finance",
            "SUM(invoiced_arr) - churned_arr - disputed_invoices",
            "CFO Office",
            "Sales Rep Performance & Quota Attainment",
            "Sales Ops",
            "SUM(closed_won_opportunity_amount) * 12",
            "Sales VP",
            "Standardize on dbt semantic model 'mart_arr.metric_net_arr' and enforce semantic layer sync to Sales Looker model.",
            0
        ),
        (
            "metric-active-users",
            "Monthly Active Users (MAU)",
            1,
            "high",
            "Exec Dashboard defines MAU as any user with >=1 login session in 30 days. Product defines it as users completing a core workspace action (38% difference).",
            "Executive Revenue & ARR Overview",
            "Executive",
            "COUNT(DISTINCT user_id) WHERE last_session >= NOW() - INTERVAL '30 DAYS'",
            "BI Team",
            "Product Daily Active Users & Retention",
            "Product",
            "COUNT(DISTINCT user_id) WHERE event_name IN ('project_created', 'export_run', 'collaboration_invite')",
            "Growth Lead",
            "Rename Exec metric to 'Logged-in Accounts' and reserve 'MAU' for value-action users as per Product definition.",
            0
        ),
        (
            "metric-cac",
            "Customer Acquisition Cost (CAC)",
            1,
            "medium",
            "Marketing calculates Blended CAC ($340). Finance calculates Paid CAC ($890 strictly dividing ad spend by paid conversions).",
            "Marketing ROI & Multi-Touch Attribution",
            "Marketing",
            "Total Ad Spend / (Organic New Customers + Paid New Customers)",
            "Demand Gen",
            "Executive Revenue & ARR Overview",
            "Finance",
            "(Total Ad Spend + Sales Comp) / Paid Attributed Customers",
            "VP Finance",
            "Label both explicitly in all charts: 'Blended CAC' and 'Fully-Loaded Paid CAC'.",
            0
        ),
        (
            "metric-gross-margin",
            "Gross Margin %",
            0,
            "none",
            "Consistently modeled across all reporting marts via ERP connector (0% variance).",
            "Executive Revenue & ARR Overview",
            "Finance",
            "(Revenue - COGS) / Revenue",
            "Finance",
            "Executive Revenue & ARR Overview",
            "Finance",
            "(Revenue - COGS) / Revenue",
            "Finance",
            "Verified clean and locked in dbt semantic catalog.",
            1
        )
    ]

    for g in glossary_data:
        db.execute("""
            INSERT INTO metric_glossary (metric_id, kpi_name, has_conflict, severity, discrepancy_summary, def_a_dashboard, def_a_dept, def_a_formula, def_a_owner, def_b_dashboard, def_b_dept, def_b_formula, def_b_owner, recommended_action, is_standardized)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, g)
    print("[+] Loaded " + str(len(glossary_data)) + " metric glossary definitions.")

    # -------------------------------------------------------------------------
    # 7. Data Request Queue (22 Requests across Kanban Stages)
    # -------------------------------------------------------------------------
    requests_data = [
        ("REQ-001", "Need monthly churn breakdown by enterprise tier for Board deck", "Sarah Lin (Chief of Staff)", "Executive", "P1 - Critical", "2026-11-02", "Preparation for upcoming Q4 Board meeting; directors asked for enterprise vs mid-market churn breakdown.", "in_triage", "already_answerable", "Already available in 'Customer Success Health & Churn Risk' dashboard. Tab 3 contains historical churn cohort breakdown filtered by Enterprise tier.", "dash-cs-churn", 0.5, 92, "2026-10-30 14:15:00", 24),
        ("REQ-002", "Export CSV of accounts with overdue invoice >$10k for finance recovery", "Marcus Vance (Collections Lead)", "Finance", "P2 - High", "2026-10-31", "High priority collections call today with top overdue clients.", "in_progress", "quick_query", "Single SQL query against silver_stripe.invoices filtering on balance_due > 10000 and status = 'past_due'. Execution time ~15 mins.", None, 1.5, 78, "2026-10-30 16:30:00", 24),
        ("REQ-003", "Build automated ingestion for Gong call transcripts into Snowflake", "Rachel Green (VP Sales Ops)", "Sales Ops", "P3 - Medium", "2026-11-20", "We want to run LLM summarization on prospect objections across deal stages to coach AEs.", "backlog", "needs_pipeline", "Requires new webhook/OAuth connector to Gong REST API, staging schema, vector embedding pipeline, and daily dbt mart. Estimated 4-6 days eng effort.", None, 36.0, 64, "2026-10-29 11:00:00", 72),
        ("REQ-004", "Why did European revenue look $400k lower yesterday in Executive dash?", "Helena Zhou (Finance Director)", "Finance", "P1 - Critical", "2026-10-31", "CEO flagged discrepancy during morning review; need immediate root cause.", "in_progress", "quick_query", "Caused by overnight failure of pipeline_stripe_billing_sync which halted EUR charge transformations in dbt stg_stripe__charges.", "dash-exec-revenue", 2.0, 96, "2026-10-31 08:15:00", 12),
        ("REQ-005", "Weekly report of top 20 enterprise accounts by feature adoption", "Tariq Edwards (Product Manager)", "Product", "P3 - Medium", "2026-11-04", "Needed to prioritize upcoming API deprecation announcements for power users.", "in_triage", "already_answerable", "Already tracked in 'Product Daily Active Users & Retention' under 'Top Accounts by Feature Engagement' filter.", "dash-product-dau", 0.5, 58, "2026-10-30 13:20:00", 48),
        ("REQ-006", "Integrate Shopify store transactions for newly acquired subsidiary", "Jason Miller (Corporate Dev)", "Operations", "P2 - High", "2026-11-15", "Post-merger integration requirement for consolidated financial reporting.", "backlog", "needs_pipeline", "New source system requires Fivetran Shopify connector configuration, bronze/silver schema modeling, and tax currency normalization.", None, 28.0, 82, "2026-10-28 09:40:00", 72),
        ("REQ-007", "Sales rep quota attainment report for EMEA team Q3", "Gillian Cole (EMEA Sales Lead)", "Sales Ops", "P3 - Medium", "2026-11-01", "Quarterly commission check verification before payroll cutoff.", "completed", "already_answerable", "Provided direct link to Looker Sales Performance dashboard with EMEA region preset filter.", "dash-sales-quota", 0.5, 70, "2026-10-27 10:00:00", 24),
        ("REQ-008", "Ingest LinkedIn sponsored content ad impressions & click metrics", "Amara Ndiaye (Performance Marketing)", "Marketing", "P2 - High", "2026-10-29", "Required to optimize Q4 holiday ad budget across B2B campaigns.", "review", "needs_pipeline", "Added LinkedIn Ads v2 connector; dbt models deployed to staging and waiting for QA approval.", None, 16.0, 75, "2026-10-25 15:00:00", 48),
        ("REQ-009", "Export list of users who visited pricing page >5 times in October", "Rachel Green (VP Sales Ops)", "Sales Ops", "P2 - High", "2026-10-31", "High intent SDR outbound cadence targeting warm accounts.", "completed", "quick_query", "Executed ClickHouse query across page_views aggregated by user_id. CSV delivered to Sales Slack.", None, 1.0, 84, "2026-10-30 09:15:00", 24),
        ("REQ-010", "Fix discrepancy between marketing ad spend and finance ledger", "Helena Zhou (Finance Director)", "Finance", "P1 - Critical", "2026-10-30", "Month-end close is blocked by a $48k imbalance in accrued marketing expenses.", "in_progress", "quick_query", "Investigating currency exchange rate table gap between NetSuite and Google Ads API sync.", None, 4.0, 94, "2026-10-30 08:00:00", 24),
        ("REQ-011", "Warehouse inventory stock level feed for customer support team", "Chloe Bennett (Head of Support)", "Support", "P3 - Medium", "2026-11-10", "Enable CS agents to check live backorder status without contacting warehouse supervisors.", "backlog", "already_answerable", "Can be surfaced via embedded iframe of 'Supply Chain & Inventory Turnover' widget inside Zendesk app.", "dash-supply-chain", 2.0, 60, "2026-10-29 14:40:00", 48),
        ("REQ-012", "Build automated alert when high-tier client NPS drops below 7", "Marcus Vance (CS Operations)", "Customer Success", "P2 - High", "2026-11-05", "Executive sponsor outreach needed within 2 hours of detractor feedback.", "in_triage", "quick_query", "Can be solved using a Snowflake alert rule or Hightouch webhook triggered on CSAT table update.", None, 3.0, 76, "2026-10-30 17:00:00", 24),
        ("REQ-013", "Engineering platform latency SLA compliance report for SOC2 audit", "Liam Vance (Principal Infra)", "Engineering", "P2 - High", "2026-11-03", "Annual SOC2 Type II compliance audit artifact collection.", "review", "already_answerable", "Grafana dashboard 'Engineering Platform Reliability' has automated 99.9% uptime compliance PDF exporter.", "dash-platform-sla", 0.5, 80, "2026-10-29 08:30:00", 48),
        ("REQ-014", "Headcount forecast vs budget variance by engineering department", "Elena Rostova (People Ops)", "HR", "P4 - Low", "2026-11-25", "Annual operating plan planning for 2027 headcount allocations.", "backlog", "already_answerable", "Looker HR Headcount dashboard has 'Hiring Plan vs Actual' toggle with departmental filters.", "dash-hr-hiring", 0.5, 42, "2026-10-28 16:15:00", 96),
        ("REQ-015", "Stream real-time fraud scoring API payload to Snowflake for model re-training", "David Kim (Data Eng)", "Data Engineering", "P2 - High", "2026-11-08", "Retrain fraud classifier model with recent false positive feedback labels.", "in_progress", "needs_pipeline", "Requires Kafka Snowpipe streaming connector setup and bronze partitioning.", None, 18.0, 81, "2026-10-29 13:10:00", 48),
        ("REQ-016", "Export customer lifetime value (LTV) deciles for loyalty tier revamp", "Sarah Lin (Chief of Staff)", "Executive", "P3 - Medium", "2026-11-07", "Designing new tiered rewards program for top 10% grossing accounts.", "backlog", "quick_query", "Ad-hoc SQL query grouping accounts into 10 NTILE buckets based on historical invoiced ARR.", None, 2.5, 66, "2026-10-30 11:45:00", 48),
        ("REQ-017", "Reconcile Stripe processing fees vs credit card gateway statements", "Marcus Vance (Collections Lead)", "Finance", "P2 - High", "2026-11-02", "Monthly variance audit revealed 12 basis points discrepancy in interchange fees.", "in_progress", "quick_query", "Comparing raw Stripe balance_transaction fee breakdown against JP Morgan settlement files.", None, 4.0, 80, "2026-10-30 15:30:00", 36),
        ("REQ-018", "Automate weekly Slack digest of top converted leads by ad channel", "Amara Ndiaye (Performance Marketing)", "Marketing", "P3 - Medium", "2026-11-12", "Send automated Monday 9 AM summary to executive marketing channel.", "in_triage", "quick_query", "Scheduled Hightouch or Census reverse-ETL sync from marketing mart to Slack webhook.", None, 2.0, 68, "2026-10-31 07:10:00", 48),
        ("REQ-019", "Add user device type and browser version to Looker Product DAU", "Tariq Edwards (Product Manager)", "Product", "P3 - Medium", "2026-11-06", "Determine whether Windows desktop app deprecation will impact enterprise power users.", "review", "needs_pipeline", "Added user_agent parsing UDF in BigQuery silver event transform and exposed dimensions in LookML.", "dash-product-dau", 8.0, 72, "2026-10-26 14:00:00", 48),
        ("REQ-020", "Quarterly sales rep commission clawbacks due to early contract cancellations", "Gillian Cole (EMEA Sales Lead)", "Sales Ops", "P2 - High", "2026-11-03", "Finance requested deduction schedules for accounts cancelled within 90-day grace period.", "backlog", "quick_query", "SQL join between closed_won Salesforce opportunities and Stripe refund cancellation events.", None, 3.0, 77, "2026-10-30 10:20:00", 36),
        ("REQ-021", "Warehouse logistics pallet scan turnaround latency for freight carriers", "Jason Miller (Corporate Dev)", "Operations", "P3 - Medium", "2026-11-14", "Carrier contract renegotiations require docking to loading turnaround benchmarks.", "backlog", "already_answerable", "Covered in 'Supply Chain & Inventory Turnover' under 'Carrier Turnaround KPIs' tab.", "dash-supply-chain", 0.5, 54, "2026-10-29 16:00:00", 72),
        ("REQ-022", "Daily automated email digest of failing dbt model tests for Platform team", "Alex Chen (Staff Eng)", "Data Engineering", "P1 - Critical", "2026-11-01", "Ensure engineering on-call catches data quality test failures before business morning hours.", "completed", "quick_query", "Configured Elementary / dbt test artifact webhook forwarding to oncall PagerDuty service.", None, 1.5, 90, "2026-10-28 11:30:00", 24)
    ]

    for req in requests_data:
        db.execute("""
            INSERT INTO data_requests (request_id, title, requester, department, urgency, deadline, why_needed, status, ai_classification, ai_rationale, matched_dashboard_id, effort_hours, priority_score, created_at, sla_hours)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, req)
    print("[+] Loaded " + str(len(requests_data)) + " data requests across Kanban stages.")

    # -------------------------------------------------------------------------
    # 8. Cost & Usage Records (6 Months: May to October 2026)
    # -------------------------------------------------------------------------
    months = [
        ("2026-05-01", 32400.0, 8200000, 21800.0, 7400.0, 48.2),
        ("2026-06-01", 35100.0, 8500000, 23600.0, 8100.0, 52.4),
        ("2026-07-01", 39800.0, 8800000, 27100.0, 9100.0, 58.1),
        ("2026-08-01", 44200.0, 9100000, 30400.0, 10100.0, 64.5),
        ("2026-09-01", 49500.0, 9300000, 34800.0, 10900.0, 71.0),
        ("2026-10-01", 54800.0, 9600000, 38900.0, 11900.0, 78.4)
    ]

    teams = [
        ("Data & Platform Eng", 0.35),
        ("Sales Operations", 0.21),
        ("Growth Marketing", 0.18),
        ("Product Analytics", 0.15),
        ("Finance & Exec", 0.11)
    ]

    warehouses = [
        ("Snowflake", 0.52),
        ("BigQuery", 0.28),
        ("Databricks", 0.20)
    ]

    cost_records = []
    c_idx = 1
    for m in months:
        m_date, total_spend, queries, compute, storage, total_tb = m
        for t_name, t_pct in teams:
            for w_name, w_pct in warehouses:
                sub_spend = total_spend * t_pct * w_pct
                sub_queries = int(queries * t_pct * w_pct)
                sub_compute = compute * t_pct * w_pct
                sub_storage = storage * t_pct * w_pct
                sub_tb = total_tb * t_pct * w_pct
                
                cost_records.append((
                    f"cost-{c_idx:04d}",
                    m_date,
                    t_name,
                    w_name,
                    None,
                    sub_queries,
                    round(sub_compute, 2),
                    round(sub_storage, 2),
                    "active_table",
                    round(sub_tb, 2)
                ))
                c_idx += 1

    for c in cost_records:
        db.execute("""
            INSERT INTO cost_usage_records (record_id, record_date, team_name, warehouse_engine, pipeline_id, query_count, compute_spend_usd, storage_spend_usd, storage_tier, storage_tb)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, c)
    print("[+] Loaded " + str(len(cost_records)) + " cost & usage records demonstrating spend growing faster than usage.")

    # -------------------------------------------------------------------------
    # 9. Waste Recommendations ($7,820/mo Reclaimable Savings)
    # -------------------------------------------------------------------------
    recs_data = [
        (
            "rec-001",
            "Downsize Over-provisioned Snowflake Warehouse",
            "Compute Waste",
            "BI_ANALYTICS_XL Warehouse",
            4600.0,
            3800.0,
            "Immediate (1-click)",
            "Zero Risk",
            "The BI_ANALYTICS_XL warehouse runs 24/7 with an average CPU utilization of only 6.8%. During 80% of operating hours, 0 active queries are queued. Downsizing to Medium with 5-minute auto-suspend will save $3,800/mo with zero impact on dashboard response times.",
            "Apply Auto-Suspend & Downsize to M",
            "pending",
            None
        ),
        (
            "rec-002",
            "Decommission Zombie Dashboard Refresh",
            "Unused Dashboard",
            "Legacy Q1 Spiff Leaderboard (Tableau)",
            920.0,
            920.0,
            "Immediate",
            "Zero Risk",
            "This dashboard executes hourly full-table scans across 85M rows on Snowflake, costing $920/mo. Access logs confirm 0 views from any user in the last 94 days. Pausing scheduled extracts will immediately eliminate this recurring cost.",
            "Pause Scheduled Extract",
            "pending",
            None
        ),
        (
            "rec-003",
            "Archive 3.8 TB of Untouched Staging Tables",
            "Storage Waste",
            "analytics_scratch.temp_event_archive_2024_02",
            1450.0,
            1450.0,
            "Low (Automated)",
            "Low Risk",
            "Table has not been queried since May 2026. Transitioning from Snowflake active storage ($23/TB) to S3 Glacier Deep Archive ($1/TB) or dropping scratch partitions will save $1,450 every month.",
            "Migrate Table to Glacier Archive",
            "pending",
            None
        ),
        (
            "rec-004",
            "Consolidate Duplicate Salesforce Ingestion Pipelines",
            "Duplicate Pipeline",
            "pipeline_sf_fivetran vs airflow_sf_sync_v2",
            2100.0,
            1650.0,
            "Medium",
            "Low Risk",
            "Two separate ingestion jobs are syncing identical Opportunity and Contact records from Salesforce into two different raw schemas. Consolidating into the single official dbt silver model will reduce redundant connector fees and compute by $1,650/mo.",
            "Deprecate Legacy Airflow Sync",
            "pending",
            None
        )
    ]

    for rec in recs_data:
        db.execute("""
            INSERT INTO waste_recommendations (rec_id, title, category, asset_name, current_monthly_cost, projected_monthly_savings, effort, risk_level, description, action_label, status, applied_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, rec)
    print("[+] Loaded " + str(len(recs_data)) + " waste recommendations ($7,820/mo reclaimable).")

    print("=" * 70)
    print("[+] PLATFORMPULSE SEEDING COMPLETE!")
    print("=" * 70)

if __name__ == "__main__":
    seed_database()
