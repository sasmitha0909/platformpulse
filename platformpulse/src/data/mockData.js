// PlatformPulse Enterprise Mock Data
// Contains realistic pipelines, dashboards, requests, cost telemetry, and metric glossary

export const initialPipelines = [
  {
    id: "pipe-stripe-billing",
    name: "pipeline_stripe_billing_sync",
    displayName: "Stripe Billing & Invoicing Sync",
    layer: "Bronze",
    status: "failed", // 'healthy' | 'delayed' | 'failed' | 'at_risk'
    lastRun: "2026-10-31 03:14 AM",
    duration: "42m 18s",
    nextRun: "2026-10-31 03:00 PM",
    owner: { name: "Alex Chen", email: "alex.c@platformpulse.io", avatar: "AC", role: "Staff Data Engineer" },
    downstreamDashboards: [
      { id: "dash-exec-revenue", name: "Executive Revenue & ARR Overview", critical: true },
      { id: "dash-cs-churn", name: "Customer Success Health & Churn Risk", critical: false }
    ],
    riskScore: "critical", // 'low' | 'medium' | 'high' | 'critical'
    riskFactors: ["Schema drift: unexpected column billing_country_iso2", "Upstream API response format change", "Retry limit reached (3/3)"],
    runtimeTrend: "+68% vs 30d avg",
    retries: 3,
    errorSummary: "ValidationError: Column 'billing_country_iso2' not found in target schema 'raw_stripe.invoices'. dbt stage stg_stripe__charges failed.",
    suggestedFix: "Apply schema migration patch v2.14 or run 'dbt run --select stg_stripe__charges+ --vars \"allow_null_country: true\"'.",
    logs: [
      "[03:00:01] Starting ingestion job for Stripe API v2024-06...",
      "[03:04:12] Fetched 184,200 charge records from Stripe Webhook stream.",
      "[03:11:45] Running validation assertions on schema...",
      "[03:14:02] ERROR: Schema mismatch detected in batch #14.",
      "[03:14:03] Field 'billing_country_iso2' (string) present in source payload but undefined in Snowflake destination table.",
      "[03:14:08] Retry #1 failed: assertion error in stg_stripe__charges.",
      "[03:14:15] Retry #2 failed: deadlock waiting for lock on raw_stripe.invoices.",
      "[03:14:22] CRITICAL: Job terminated with exit code 1. Notification dispatch queued to #data-incidents."
    ],
    slaMinutes: 120,
    actualMinutes: 245
  },
  {
    id: "pipe-salesforce-crm",
    name: "pipeline_salesforce_crm_etl",
    displayName: "Salesforce Opportunity & Deals Sync",
    layer: "Silver",
    status: "delayed",
    lastRun: "2026-10-31 06:45 AM",
    duration: "1h 12m",
    nextRun: "2026-10-31 10:45 AM",
    owner: { name: "Maya Patel", email: "maya.p@platformpulse.io", avatar: "MP", role: "Senior Analytics Engineer" },
    downstreamDashboards: [
      { id: "dash-sales-quota", name: "Sales Rep Performance & Quota Attainment", critical: true },
      { id: "dash-exec-revenue", name: "Executive Revenue & ARR Overview", critical: true }
    ],
    riskScore: "high",
    riskFactors: ["Rising runtime (+48%) over last 5 runs", "Salesforce REST API bulk rate limiting (85% consumed)", "Pending schema lock"],
    runtimeTrend: "+48% vs 30d avg",
    retries: 1,
    errorSummary: "API Throttling: Salesforce API rate limit reached 85% threshold. Ingestion delayed by 45 minutes.",
    suggestedFix: "Switch incremental extraction from REST query to Salesforce Bulk API 2.0 PK-Chunking.",
    logs: [
      "[05:33:00] Initialized Salesforce Opportunity extractor...",
      "[05:50:11] Warning: 429 Too Many Requests received from Salesforce API. Backing off 120s...",
      "[06:12:00] Resumed sync. 42,900 rows updated in silver.opportunities.",
      "[06:45:00] Run completed with 45m SLA delay."
    ],
    slaMinutes: 45,
    actualMinutes: 72
  },
  {
    id: "pipe-snowflake-dbt-gold",
    name: "pipeline_snowflake_dbt_gold_marts",
    displayName: "DBT Marts: Fact ARR & Enterprise Cohorts",
    layer: "Gold",
    status: "failed",
    lastRun: "2026-10-31 04:30 AM",
    duration: "18m 05s",
    nextRun: "2026-10-31 08:30 AM",
    owner: { name: "Alex Chen", email: "alex.c@platformpulse.io", avatar: "AC", role: "Staff Data Engineer" },
    downstreamDashboards: [
      { id: "dash-exec-revenue", name: "Executive Revenue & ARR Overview", critical: true },
      { id: "dash-cs-churn", name: "Customer Success Health & Churn Risk", critical: true }
    ],
    riskScore: "critical",
    riskFactors: ["Upstream dependency pipe-stripe-billing failed", "Stale input tables in stage", "Data freshness SLA breached"],
    runtimeTrend: "Aborted early",
    retries: 2,
    errorSummary: "DependencyFailure: Required upstream model 'stg_stripe__charges' is stale (last updated 18 hours ago).",
    suggestedFix: "Resolve upstream Stripe billing sync first, then trigger 'dbt build --select marts.revenue+'.",
    logs: [
      "[04:12:00] Validating upstream parent dependencies...",
      "[04:12:02] FAILED: Upstream model 'stg_stripe__charges' timestamp older than 12h threshold.",
      "[04:12:05] Aborting dbt run for mart_enterprise_arr_cohorts to avoid corrupting financial reporting.",
      "[04:12:10] Sent warning banner to Tableau Metadata API."
    ],
    slaMinutes: 30,
    actualMinutes: 18
  },
  {
    id: "pipe-kafka-clickstream",
    name: "pipeline_kafka_user_events_stream",
    displayName: "Kafka Real-Time Clickstream Ingestion",
    layer: "Bronze",
    status: "healthy",
    lastRun: "2026-10-31 07:58 AM",
    duration: "Streaming (Continuous)",
    nextRun: "Active",
    owner: { name: "Liam Vance", email: "liam.v@platformpulse.io", avatar: "LV", role: "Principal Infra Engineer" },
    downstreamDashboards: [
      { id: "dash-product-dau", name: "Product Daily Active Users & Retention", critical: true },
      { id: "dash-platform-sla", name: "Engineering Platform Reliability & Latency", critical: false }
    ],
    riskScore: "low",
    riskFactors: ["Zero lag detected in consumer group 'ingest-clickhouse-v2'"],
    runtimeTrend: "Stable (-2%)",
    retries: 0,
    errorSummary: null,
    suggestedFix: null,
    logs: [
      "[07:50:00] Consumer lag: 142 records (0.01s). Throughput: 14,800 events/sec.",
      "[07:55:00] Checkpoint committed successfully. Partition rebalance completed in 18ms."
    ],
    slaMinutes: 5,
    actualMinutes: 1
  },
  {
    id: "pipe-amplitude-events",
    name: "pipeline_amplitude_product_clicks",
    displayName: "Amplitude Funnel & Session Modeling",
    layer: "Silver",
    status: "healthy",
    lastRun: "2026-10-31 07:15 AM",
    duration: "24m 10s",
    nextRun: "2026-10-31 11:15 AM",
    owner: { name: "Sarah Jenkins", email: "sarah.j@platformpulse.io", avatar: "SJ", role: "Product Data Analyst" },
    downstreamDashboards: [
      { id: "dash-product-dau", name: "Product Daily Active Users & Retention", critical: true }
    ],
    riskScore: "low",
    riskFactors: ["Healthy run within SLA window"],
    runtimeTrend: "Nominal",
    retries: 0,
    errorSummary: null,
    suggestedFix: null,
    logs: [
      "[06:51:00] Fetching batch events from Amplitude Export API...",
      "[07:08:20] Enriched 2.4M user session funnels in BigQuery.",
      "[07:15:10] Sync completed."
    ],
    slaMinutes: 40,
    actualMinutes: 24
  },
  {
    id: "pipe-marketing-adspend",
    name: "pipeline_marketing_adspend_attribution",
    displayName: "Multi-Channel Ad Spend Attribution",
    layer: "Silver",
    status: "at_risk",
    lastRun: "2026-10-31 05:00 AM",
    duration: "52m 40s",
    nextRun: "2026-10-31 05:00 PM",
    owner: { name: "Maya Patel", email: "maya.p@platformpulse.io", avatar: "MP", role: "Senior Analytics Engineer" },
    downstreamDashboards: [
      { id: "dash-marketing-roi", name: "Marketing ROI & Multi-Touch Attribution", critical: true }
    ],
    riskScore: "high",
    riskFactors: ["Meta Ads Graph API deprecation warning for field 'campaign_bid_strategy'", "Retry count 2x over normal", "Runtime +34%"],
    runtimeTrend: "+34% vs 30d avg",
    retries: 2,
    errorSummary: "API Warning: Meta Graph API v18.0 deprecation on 2026-11-15. 2 retries on Google Ads token refresh.",
    suggestedFix: "Migrate OAuth credentials to service account and update Meta API client to v20.0.",
    logs: [
      "[04:08:00] Pulling Google Ads, LinkedIn Ads, Meta Ads...",
      "[04:22:15] Warning: Token refresh took 3 attempts on Google Ads.",
      "[04:45:00] Currency normalization applied. 14,200 ad spend rows loaded."
    ],
    slaMinutes: 60,
    actualMinutes: 52
  },
  {
    id: "pipe-zendesk-tickets",
    name: "pipeline_zendesk_support_tickets",
    displayName: "Zendesk Support & CSAT Ingestion",
    layer: "Bronze",
    status: "healthy",
    lastRun: "2026-10-31 07:30 AM",
    duration: "11m 40s",
    nextRun: "2026-10-31 09:30 AM",
    owner: { name: "David Kim", email: "david.k@platformpulse.io", avatar: "DK", role: "Data Engineer" },
    downstreamDashboards: [
      { id: "dash-cs-churn", name: "Customer Success Health & Churn Risk", critical: false }
    ],
    riskScore: "low",
    riskFactors: ["Nominal API response time", "0 errors"],
    runtimeTrend: "Stable (-4%)",
    retries: 0,
    errorSummary: null,
    suggestedFix: null,
    logs: ["[07:18:20] Syncing Zendesk ticket metrics... 1,840 tickets ingested."],
    slaMinutes: 20,
    actualMinutes: 11
  },
  {
    id: "pipe-netsuite-recon",
    name: "pipeline_netsuite_erp_reconciliation",
    displayName: "NetSuite ERP GL Reconciliation",
    layer: "Gold",
    status: "at_risk",
    lastRun: "2026-10-31 02:45 AM",
    duration: "1h 35m",
    nextRun: "2026-11-01 02:00 AM",
    owner: { name: "Alex Chen", email: "alex.c@platformpulse.io", avatar: "AC", role: "Staff Data Engineer" },
    downstreamDashboards: [
      { id: "dash-exec-revenue", name: "Executive Revenue & ARR Overview", critical: true }
    ],
    riskScore: "medium",
    riskFactors: ["Late upstream data from SuiteTalk SOAP endpoint", "Memory pressure (89% memory limit in container)"],
    runtimeTrend: "+22% vs 30d avg",
    retries: 1,
    errorSummary: "Memory alert: High RAM utilization (7.2GB / 8GB) during ledger cross-reconciliation.",
    suggestedFix: "Increase pod memory limit to 16GB or enable partition streaming in NetSuite extractor.",
    logs: ["[01:10:00] Ingesting general ledger balances...", "[02:30:10] Container memory peaked at 89%."],
    slaMinutes: 90,
    actualMinutes: 95
  },
  {
    id: "pipe-workday-hr",
    name: "pipeline_hr_workday_headcount",
    displayName: "Workday Org Hierarchy & Headcount",
    layer: "Bronze",
    status: "healthy",
    lastRun: "2026-10-31 01:00 AM",
    duration: "14m 20s",
    nextRun: "2026-11-01 01:00 AM",
    owner: { name: "Elena Rostova", email: "elena.r@platformpulse.io", avatar: "ER", role: "BI Systems Lead" },
    downstreamDashboards: [
      { id: "dash-hr-hiring", name: "HR Headcount & Hiring Velocity", critical: true }
    ],
    riskScore: "low",
    riskFactors: ["Clean run"],
    runtimeTrend: "Stable",
    retries: 0,
    errorSummary: null,
    suggestedFix: null,
    logs: ["[01:00:00] Ingestion of 2,410 active employee records finished."],
    slaMinutes: 30,
    actualMinutes: 14
  },
  {
    id: "pipe-inventory-logistics",
    name: "pipeline_inventory_warehouse_logistics",
    displayName: "Warehouse Logistics & SKU Stocking",
    layer: "Silver",
    status: "healthy",
    lastRun: "2026-10-31 06:10 AM",
    duration: "31m 15s",
    nextRun: "2026-10-31 12:10 PM",
    owner: { name: "David Kim", email: "david.k@platformpulse.io", avatar: "DK", role: "Data Engineer" },
    downstreamDashboards: [
      { id: "dash-supply-chain", name: "Supply Chain & Inventory Turnover", critical: true }
    ],
    riskScore: "low",
    riskFactors: ["All checkpoints validated"],
    runtimeTrend: "Stable (+1%)",
    retries: 0,
    errorSummary: null,
    suggestedFix: null,
    logs: ["[06:10:00] 18 regional fulfillment centers synced successfully."],
    slaMinutes: 45,
    actualMinutes: 31
  },
  {
    id: "pipe-fraud-ml-features",
    name: "pipeline_fraud_ml_feature_store",
    displayName: "ML Fraud Risk Real-Time Feature Store",
    layer: "ML",
    status: "healthy",
    lastRun: "2026-10-31 07:45 AM",
    duration: "8m 10s",
    nextRun: "2026-10-31 08:00 AM",
    owner: { name: "Liam Vance", email: "liam.v@platformpulse.io", avatar: "LV", role: "Principal Infra Engineer" },
    downstreamDashboards: [
      { id: "dash-platform-sla", name: "Engineering Platform Reliability & Latency", critical: true }
    ],
    riskScore: "low",
    riskFactors: ["Feature store drift < 0.02 (within safety band)"],
    runtimeTrend: "Fast (-8%)",
    retries: 0,
    errorSummary: null,
    suggestedFix: null,
    logs: ["[07:45:00] 480 feature vectors refreshed into Feast/Redis."],
    slaMinutes: 15,
    actualMinutes: 8
  },
  {
    id: "pipe-hubspot-leads",
    name: "pipeline_hubspot_lead_scoring",
    displayName: "HubSpot Inbound Lead Scoring & Enriched Data",
    layer: "Silver",
    status: "delayed",
    lastRun: "2026-10-31 07:10 AM",
    duration: "48m 12s",
    nextRun: "2026-10-31 10:10 AM",
    owner: { name: "Sarah Jenkins", email: "sarah.j@platformpulse.io", avatar: "SJ", role: "Product Data Analyst" },
    downstreamDashboards: [
      { id: "dash-marketing-roi", name: "Marketing ROI & Multi-Touch Attribution", critical: false },
      { id: "dash-sales-quota", name: "Sales Rep Performance & Quota Attainment", critical: true }
    ],
    riskScore: "medium",
    riskFactors: ["Rate limit backoff", "Rising data volume +28%"],
    runtimeTrend: "+28% vs 30d avg",
    retries: 1,
    errorSummary: "API Throttling: 24 minute delay due to HubSpot webhook backpressure.",
    suggestedFix: "Implement message queue buffer (SQS/PubSub) before ingestion.",
    logs: ["[06:22:00] Enqueueing 12,400 inbound lead signals...", "[07:10:00] Finished."],
    slaMinutes: 30,
    actualMinutes: 48
  },
  {
    id: "pipe-databricks-churn",
    name: "pipeline_databricks_churn_model",
    displayName: "Databricks Customer Churn Predictive Inference",
    layer: "ML",
    status: "at_risk",
    lastRun: "2026-10-31 04:00 AM",
    duration: "1h 05m",
    nextRun: "2026-11-01 04:00 AM",
    owner: { name: "Liam Vance", email: "liam.v@platformpulse.io", avatar: "LV", role: "Principal Infra Engineer" },
    downstreamDashboards: [
      { id: "dash-cs-churn", name: "Customer Success Health & Churn Risk", critical: true }
    ],
    riskScore: "high",
    riskFactors: ["Driver node CPU saturation (96%)", "Cost per inference batch jumped 34%"],
    runtimeTrend: "+41% vs 30d avg",
    retries: 1,
    errorSummary: "Compute cost anomaly: 8-node cluster ran 40m longer than baseline due to unpartitioned shuffle.",
    suggestedFix: "Enable adaptive query execution (AQE) and repartition by tenant_tier.",
    logs: ["[02:55:00] Spark batch started...", "[04:00:00] Output saved with high shuffle spill."],
    slaMinutes: 45,
    actualMinutes: 65
  },
  {
    id: "pipe-postgres-app-db",
    name: "pipeline_postgres_cdc_debezium",
    displayName: "Production PostgreSQL CDC Streaming (Debezium)",
    layer: "Bronze",
    status: "healthy",
    lastRun: "2026-10-31 07:59 AM",
    duration: "Streaming (Continuous)",
    nextRun: "Active",
    owner: { name: "David Kim", email: "david.k@platformpulse.io", avatar: "DK", role: "Data Engineer" },
    downstreamDashboards: [
      { id: "dash-product-dau", name: "Product Daily Active Users & Retention", critical: true },
      { id: "dash-cs-churn", name: "Customer Success Health & Churn Risk", critical: false }
    ],
    riskScore: "low",
    riskFactors: ["Replication slot WAL size: 28MB (healthy)"],
    runtimeTrend: "Optimal",
    retries: 0,
    errorSummary: null,
    suggestedFix: null,
    logs: ["[07:59:00] 4,200 WAL events streamed to Kafka topic prod.app.users."],
    slaMinutes: 5,
    actualMinutes: 1
  }
];

export const initialDashboards = [
  {
    id: "dash-exec-revenue",
    name: "Executive Revenue & ARR Overview",
    department: "Executive & Finance",
    owner: "CFO Analytics Office",
    viewersDaily: 48,
    isExecutive: true,
    score: 48, // Dropped because of Stripe failure!
    status: "stale", // 'trusted' (>=85) | 'caution' (60-84) | 'stale' (<60)
    lastSync: "14 hours ago (Expected 2h ago)",
    upstreamPipelines: ["pipe-stripe-billing", "pipe-snowflake-dbt-gold", "pipe-netsuite-recon"],
    breakdown: {
      freshness: 35, // 0-100
      pipelineReliability: 42,
      schemaStability: 50,
      dataQuality: 55,
      metricConsistency: 60
    },
    issues: [
      "Upstream pipeline 'pipeline_stripe_billing_sync' failed overnight",
      "Fact ARR table contains 14,200 null records in current month charges",
      "Metric definition conflict: 'Net ARR' differs from Sales CRM definition by $1.2M",
      "Data freshness SLA exceeded by 12 hours"
    ],
    recentAnomalies: [
      { type: "Null Spike", detail: "14.2% nulls in billing_country", severity: "high" },
      { type: "Value Anomaly", detail: "Negative subscription charge detected (-$12,400)", severity: "critical" }
    ],
    url: "https://tableau.internal.company.com/#/views/Executive_ARR_Q4"
  },
  {
    id: "dash-sales-quota",
    name: "Sales Rep Performance & Quota Attainment",
    department: "Sales Operations",
    owner: "Maya Patel (Sales Ops)",
    viewersDaily: 92,
    isExecutive: false,
    score: 68,
    status: "caution",
    lastSync: "3.5 hours ago",
    upstreamPipelines: ["pipe-salesforce-crm", "pipe-hubspot-leads"],
    breakdown: {
      freshness: 70,
      pipelineReliability: 65,
      schemaStability: 85,
      dataQuality: 75,
      metricConsistency: 45
    },
    issues: [
      "Salesforce sync was delayed by 45 minutes due to API rate throttling",
      "Metric conflict: 'Quota Attainment %' includes unclosed verbal commitments"
    ],
    recentAnomalies: [
      { type: "Delayed Sync", detail: "Inbound leads data lag: 3.5h", severity: "medium" }
    ],
    url: "https://looker.internal.company.com/dashboards/184"
  },
  {
    id: "dash-product-dau",
    name: "Product Daily Active Users & Retention",
    department: "Product Growth",
    owner: "Sarah Jenkins (Product)",
    viewersDaily: 134,
    isExecutive: true,
    score: 96,
    status: "trusted",
    lastSync: "8 minutes ago",
    upstreamPipelines: ["pipe-kafka-clickstream", "pipe-amplitude-events", "pipe-postgres-app-db"],
    breakdown: {
      freshness: 99,
      pipelineReliability: 98,
      schemaStability: 95,
      dataQuality: 94,
      metricConsistency: 92
    },
    issues: [],
    recentAnomalies: [],
    url: "https://looker.internal.company.com/dashboards/92"
  },
  {
    id: "dash-marketing-roi",
    name: "Marketing ROI & Multi-Touch Attribution",
    department: "Growth Marketing",
    owner: "Elena Rostova (Growth)",
    viewersDaily: 38,
    isExecutive: false,
    score: 72,
    status: "caution",
    lastSync: "2.1 hours ago",
    upstreamPipelines: ["pipe-marketing-adspend", "pipe-hubspot-leads"],
    breakdown: {
      freshness: 80,
      pipelineReliability: 70,
      schemaStability: 75,
      dataQuality: 68,
      metricConsistency: 65
    },
    issues: [
      "Meta Ads Graph API version upgrade required before Nov 15",
      "Currency conversion rate mismatch for 4 EUR ad campaigns"
    ],
    recentAnomalies: [
      { type: "Calculation Discrepancy", detail: "Blended CAC vs Paid CAC definition difference", severity: "medium" }
    ],
    url: "https://tableau.internal.company.com/#/views/Marketing_Attribution_2026"
  },
  {
    id: "dash-cs-churn",
    name: "Customer Success Health & Churn Risk",
    department: "Customer Success",
    owner: "David Kim (Data Eng)",
    viewersDaily: 64,
    isExecutive: false,
    score: 88,
    status: "trusted",
    lastSync: "45 minutes ago",
    upstreamPipelines: ["pipe-zendesk-tickets", "pipe-databricks-churn"],
    breakdown: {
      freshness: 90,
      pipelineReliability: 86,
      schemaStability: 92,
      dataQuality: 88,
      metricConsistency: 84
    },
    issues: [
      "Minor compute spike in Databricks predictive batch, data arrived on time"
    ],
    recentAnomalies: [],
    url: "https://metabase.internal.company.com/dashboard/41"
  },
  {
    id: "dash-supply-chain",
    name: "Supply Chain & Inventory Turnover",
    department: "Logistics & Ops",
    owner: "Alex Chen (Staff Eng)",
    viewersDaily: 29,
    isExecutive: false,
    score: 91,
    status: "trusted",
    lastSync: "1.2 hours ago",
    upstreamPipelines: ["pipe-inventory-logistics"],
    breakdown: {
      freshness: 92,
      pipelineReliability: 95,
      schemaStability: 94,
      dataQuality: 89,
      metricConsistency: 85
    },
    issues: [],
    recentAnomalies: [],
    url: "https://tableau.internal.company.com/#/views/Warehouse_Logistics_Realtime"
  },
  {
    id: "dash-platform-sla",
    name: "Engineering Platform Reliability & Latency",
    department: "Platform & Infra",
    owner: "Liam Vance (Principal Infra)",
    viewersDaily: 85,
    isExecutive: true,
    score: 98,
    status: "trusted",
    lastSync: "2 minutes ago",
    upstreamPipelines: ["pipe-kafka-clickstream", "pipe-fraud-ml-features"],
    breakdown: {
      freshness: 100,
      pipelineReliability: 99,
      schemaStability: 98,
      dataQuality: 97,
      metricConsistency: 96
    },
    issues: [],
    recentAnomalies: [],
    url: "https://grafana.internal.company.com/d/platform-sla"
  },
  {
    id: "dash-hr-hiring",
    name: "HR Headcount & Hiring Velocity",
    department: "People Ops",
    owner: "Elena Rostova (BI Lead)",
    viewersDaily: 19,
    isExecutive: false,
    score: 89,
    status: "trusted",
    lastSync: "3 hours ago",
    upstreamPipelines: ["pipe-workday-hr"],
    breakdown: {
      freshness: 88,
      pipelineReliability: 96,
      schemaStability: 94,
      dataQuality: 84,
      metricConsistency: 82
    },
    issues: [],
    recentAnomalies: [],
    url: "https://looker.internal.company.com/dashboards/hr-org"
  }
];

export const metricGlossary = [
  {
    id: "metric-net-arr",
    kpiName: "Net ARR (Annual Recurring Revenue)",
    hasConflict: true,
    severity: "critical",
    conflictSummary: "Finance excludes pending dispute invoices and pilot accounts; Sales CRM counts any signed contract regardless of billing status.",
    discrepancy: "$1,240,000 variance between Finance and Sales reports",
    definitions: [
      {
        dashboard: "Executive Revenue & ARR Overview",
        department: "Finance",
        formula: "SUM(invoiced_arr) - churned_arr - disputed_invoices",
        owner: "CFO Office",
        status: "Official Financial Standard"
      },
      {
        dashboard: "Sales Rep Performance & Quota Attainment",
        department: "Sales Ops",
        formula: "SUM(closed_won_opportunity_amount) * 12",
        owner: "Sales VP",
        status: "Conflicting CRM Definition"
      }
    ],
    recommendedAction: "Standardize on dbt semantic model 'mart_arr.metric_net_arr' and enforce semantic layer sync to Sales Looker model."
  },
  {
    id: "metric-active-users",
    kpiName: "Monthly Active Users (MAU)",
    hasConflict: true,
    severity: "high",
    conflictSummary: "Exec Dashboard defines MAU as any user with >=1 login session in 30 days. Product defines it as users completing a core workspace action.",
    discrepancy: "38% difference (Exec reports 420k, Product reports 260k)",
    definitions: [
      {
        dashboard: "Executive Revenue & ARR Overview",
        department: "Executive",
        formula: "COUNT(DISTINCT user_id) WHERE last_session >= NOW() - INTERVAL '30 DAYS'",
        owner: "BI Team",
        status: "Legacy Broad Definition"
      },
      {
        dashboard: "Product Daily Active Users & Retention",
        department: "Product",
        formula: "COUNT(DISTINCT user_id) WHERE event_name IN ('project_created', 'export_run', 'collaboration_invite')",
        owner: "Growth Lead",
        status: "Value-Driven Active User Definition"
      }
    ],
    recommendedAction: "Rename Exec metric to 'Logged-in Accounts' and reserve 'MAU' for value-action users as per Product definition."
  },
  {
    id: "metric-cac",
    kpiName: "Customer Acquisition Cost (CAC)",
    hasConflict: true,
    severity: "medium",
    conflictSummary: "Marketing calculates Blended CAC (including organic signups). Finance calculates Paid CAC (strictly dividing ad spend by paid conversions).",
    discrepancy: "$340 Blended vs $890 Paid per account",
    definitions: [
      {
        dashboard: "Marketing ROI & Multi-Touch Attribution",
        department: "Marketing",
        formula: "Total Ad Spend / (Organic New Customers + Paid New Customers)",
        owner: "Demand Gen",
        status: "Blended Metric"
      },
      {
        dashboard: "Executive Revenue & ARR Overview",
        department: "Finance",
        formula: "(Total Ad Spend + Sales Comp) / Paid Attributed Customers",
        owner: "VP Finance",
        status: "Unit Economics Standard"
      }
    ],
    recommendedAction: "Label both explicitly in all charts: 'Blended CAC' and 'Fully-Loaded Paid CAC'."
  },
  {
    id: "metric-gross-margin",
    kpiName: "Gross Margin %",
    hasConflict: false,
    severity: "none",
    conflictSummary: "Consistently modeled across all reporting marts via ERP connector.",
    discrepancy: "0% variance",
    definitions: [
      {
        dashboard: "Executive Revenue & ARR Overview",
        department: "Finance",
        formula: "(Revenue - COGS) / Revenue",
        owner: "Finance",
        status: "Unified Definition"
      }
    ],
    recommendedAction: "Verified clean and locked in dbt semantic catalog."
  }
];

export const initialRequests = [
  {
    id: "REQ-001",
    title: "Need monthly churn breakdown by enterprise tier for Board deck",
    requester: "Sarah Lin (Chief of Staff)",
    department: "Executive",
    urgency: "P1 - Critical",
    deadline: "2026-11-02",
    whyNeeded: "Preparation for upcoming Q4 Board meeting; directors asked for enterprise vs mid-market churn breakdown.",
    status: "in_triage", // 'backlog' | 'in_triage' | 'in_progress' | 'review' | 'completed'
    aiClassification: "already_answerable", // 'already_answerable' | 'quick_query' | 'needs_pipeline'
    aiRationale: "Already available in 'Customer Success Health & Churn Risk' dashboard. Tab 3 contains historical churn cohort breakdown filtered by Enterprise tier.",
    matchedAsset: {
      id: "dash-cs-churn",
      name: "Customer Success Health & Churn Risk",
      tab: "Cohort Retention & Tier Splits",
      url: "https://metabase.internal.company.com/dashboard/41#tab-cohorts"
    },
    effortHours: 0.5,
    priorityScore: 92,
    createdAt: "2026-10-30 02:15 PM",
    slaRemainingHours: 8,
    isOverdue: false
  },
  {
    id: "REQ-002",
    title: "Export CSV of accounts with overdue invoice >$10k for finance recovery",
    requester: "Marcus Vance (Collections Lead)",
    department: "Finance",
    urgency: "P2 - High",
    deadline: "2026-10-31",
    whyNeeded: "High priority collections call today with top overdue clients.",
    status: "in_progress",
    aiClassification: "quick_query",
    aiRationale: "Single SQL query against `silver_stripe.invoices` filtering on balance_due > 10000 and status = 'past_due'. Execution time ~15 mins.",
    matchedAsset: null,
    effortHours: 1.5,
    priorityScore: 78,
    createdAt: "2026-10-30 04:30 PM",
    slaRemainingHours: 2,
    isOverdue: false
  },
  {
    id: "REQ-003",
    title: "Build automated ingestion for Gong call transcripts into Snowflake",
    requester: "Rachel Green (VP Sales Ops)",
    department: "Sales Ops",
    urgency: "P3 - Medium",
    deadline: "2026-11-20",
    whyNeeded: "We want to run LLM summarization on prospect objections across deal stages to coach AEs.",
    status: "backlog",
    aiClassification: "needs_pipeline",
    aiRationale: "Requires new webhook/OAuth connector to Gong REST API, staging schema, vector embedding pipeline, and daily dbt mart. Estimated 4-6 days eng effort.",
    matchedAsset: null,
    effortHours: 36,
    priorityScore: 64,
    createdAt: "2026-10-29 11:00 AM",
    slaRemainingHours: 72,
    isOverdue: false
  },
  {
    id: "REQ-004",
    title: "Why did European revenue look $400k lower yesterday in Executive dash?",
    requester: "Helena Zhou (Finance Director)",
    department: "Finance",
    urgency: "P1 - Critical",
    deadline: "2026-10-31",
    whyNeeded: "CEO flagged discrepancy during morning review; need immediate root cause.",
    status: "in_progress",
    aiClassification: "quick_query",
    aiRationale: "Caused by overnight failure of `pipeline_stripe_billing_sync` which halted EUR charge transformations in dbt stg_stripe__charges.",
    matchedAsset: {
      id: "dash-exec-revenue",
      name: "Executive Revenue & ARR Overview",
      tab: "Geographic Splits",
      url: "https://tableau.internal.company.com/#/views/Executive_ARR_Q4"
    },
    effortHours: 2,
    priorityScore: 96,
    createdAt: "2026-10-31 08:15 AM",
    slaRemainingHours: 1,
    isOverdue: false
  },
  {
    id: "REQ-005",
    title: "Weekly report of top 20 enterprise accounts by feature adoption",
    requester: "Tariq Edwards (Product Manager)",
    department: "Product",
    urgency: "P3 - Medium",
    deadline: "2026-11-04",
    whyNeeded: "Needed to prioritize upcoming API deprecation announcements for power users.",
    status: "in_triage",
    aiClassification: "already_answerable",
    aiRationale: "Already tracked in 'Product Daily Active Users & Retention' under 'Top Accounts by Feature Engagement' filter.",
    matchedAsset: {
      id: "dash-product-dau",
      name: "Product Daily Active Users & Retention",
      tab: "Enterprise Accounts Deep Dive",
      url: "https://looker.internal.company.com/dashboards/92#accounts"
    },
    effortHours: 0.5,
    priorityScore: 58,
    createdAt: "2026-10-30 01:20 PM",
    slaRemainingHours: 36,
    isOverdue: false
  },
  {
    id: "REQ-006",
    title: "Integrate Shopify store transactions for newly acquired subsidiary",
    requester: "Jason Miller (Corporate Dev)",
    department: "Operations",
    urgency: "P2 - High",
    deadline: "2026-11-15",
    whyNeeded: "Post-merger integration requirement for consolidated financial reporting.",
    status: "backlog",
    aiClassification: "needs_pipeline",
    aiRationale: "New source system requires Fivetran Shopify connector configuration, bronze/silver schema modeling, and tax currency normalization.",
    matchedAsset: null,
    effortHours: 28,
    priorityScore: 82,
    createdAt: "2026-10-28 09:40 AM",
    slaRemainingHours: 48,
    isOverdue: false
  },
  {
    id: "REQ-007",
    title: "Sales rep quota attainment report for EMEA team Q3",
    requester: "Gillian Cole (EMEA Sales Lead)",
    department: "Sales Ops",
    urgency: "P3 - Medium",
    deadline: "2026-11-01",
    whyNeeded: "Quarterly commission check verification before payroll cutoff.",
    status: "completed",
    aiClassification: "already_answerable",
    aiRationale: "Provided direct link to Looker Sales Performance dashboard with EMEA region preset filter.",
    matchedAsset: {
      id: "dash-sales-quota",
      name: "Sales Rep Performance & Quota Attainment",
      tab: "Regional Breakdowns",
      url: "https://looker.internal.company.com/dashboards/184?region=EMEA"
    },
    effortHours: 0.5,
    priorityScore: 70,
    createdAt: "2026-10-27 10:00 AM",
    slaRemainingHours: 0,
    isOverdue: false
  },
  {
    id: "REQ-008",
    title: "Ingest LinkedIn sponsored content ad impressions & click metrics",
    requester: "Amara Ndiaye (Performance Marketing)",
    department: "Marketing",
    urgency: "P2 - High",
    deadline: "2026-10-29",
    whyNeeded: "Required to optimize Q4 holiday ad budget across B2B campaigns.",
    status: "review",
    aiClassification: "needs_pipeline",
    aiRationale: "Added LinkedIn Ads v2 connector; dbt models deployed to staging and waiting for QA approval.",
    matchedAsset: null,
    effortHours: 16,
    priorityScore: 75,
    createdAt: "2026-10-25 03:00 PM",
    slaRemainingHours: -18, // Overdue by 18 hours!
    isOverdue: true
  },
  {
    id: "REQ-009",
    title: "Export list of users who visited pricing page >5 times in October",
    requester: "Rachel Green (VP Sales Ops)",
    department: "Sales Ops",
    urgency: "P2 - High",
    deadline: "2026-10-31",
    whyNeeded: "High intent SDR outbound cadence targeting warm accounts.",
    status: "completed",
    aiClassification: "quick_query",
    aiRationale: "Executed ClickHouse query across `page_views` aggregated by user_id. CSV delivered to Sales Slack.",
    matchedAsset: null,
    effortHours: 1,
    priorityScore: 84,
    createdAt: "2026-10-30 09:15 AM",
    slaRemainingHours: 0,
    isOverdue: false
  },
  {
    id: "REQ-010",
    title: "Fix discrepancy between marketing ad spend and finance ledger",
    requester: "Helena Zhou (Finance Director)",
    department: "Finance",
    urgency: "P1 - Critical",
    deadline: "2026-10-30",
    whyNeeded: "Month-end close is blocked by a $48k imbalance in accrued marketing expenses.",
    status: "in_progress",
    aiClassification: "quick_query",
    aiRationale: "Investigating currency exchange rate table gap between NetSuite and Google Ads API sync.",
    matchedAsset: null,
    effortHours: 4,
    priorityScore: 94,
    createdAt: "2026-10-30 08:00 AM",
    slaRemainingHours: -6,
    isOverdue: true
  },
  {
    id: "REQ-011",
    title: "Warehouse inventory stock level feed for customer support team",
    requester: "Chloe Bennett (Head of Support)",
    department: "Support",
    urgency: "P3 - Medium",
    deadline: "2026-11-10",
    whyNeeded: "Enable CS agents to check live backorder status without contacting warehouse supervisors.",
    status: "backlog",
    aiClassification: "already_answerable",
    aiRationale: "Can be surfaced via embedded iframe of 'Supply Chain & Inventory Turnover' widget inside Zendesk app.",
    matchedAsset: {
      id: "dash-supply-chain",
      name: "Supply Chain & Inventory Turnover",
      tab: "SKU Level Lookup",
      url: "https://tableau.internal.company.com/#/views/Warehouse_Logistics_Realtime"
    },
    effortHours: 2,
    priorityScore: 60,
    createdAt: "2026-10-29 02:40 PM",
    slaRemainingHours: 64,
    isOverdue: false
  },
  {
    id: "REQ-012",
    title: "Build automated alert when high-tier client NPS drops below 7",
    requester: "Marcus Vance (CS Operations)",
    department: "Customer Success",
    urgency: "P2 - High",
    deadline: "2026-11-05",
    whyNeeded: "Executive sponsor outreach needed within 2 hours of detractor feedback.",
    status: "in_triage",
    aiClassification: "quick_query",
    aiRationale: "Can be solved using a Snowflake alert rule or Hightouch webhook triggered on CSAT table update.",
    matchedAsset: null,
    effortHours: 3,
    priorityScore: 76,
    createdAt: "2026-10-30 05:00 PM",
    slaRemainingHours: 24,
    isOverdue: false
  },
  {
    id: "REQ-013",
    title: "Engineering platform latency SLA compliance report for SOC2 audit",
    requester: "Liam Vance (Principal Infra)",
    department: "Engineering",
    urgency: "P2 - High",
    deadline: "2026-11-03",
    whyNeeded: "Annual SOC2 Type II compliance audit artifact collection.",
    status: "review",
    aiClassification: "already_answerable",
    aiRationale: "Grafana dashboard 'Engineering Platform Reliability' has automated 99.9% uptime compliance PDF exporter.",
    matchedAsset: {
      id: "dash-platform-sla",
      name: "Engineering Platform Reliability & Latency",
      tab: "Audit Evidence Exporter",
      url: "https://grafana.internal.company.com/d/platform-sla"
    },
    effortHours: 0.5,
    priorityScore: 80,
    createdAt: "2026-10-29 08:30 AM",
    slaRemainingHours: 14,
    isOverdue: false
  },
  {
    id: "REQ-014",
    title: "Headcount forecast vs budget variance by engineering department",
    requester: "Elena Rostova (People Ops)",
    department: "HR",
    urgency: "P4 - Low",
    deadline: "2026-11-25",
    whyNeeded: "Annual operating plan planning for 2027 headcount allocations.",
    status: "backlog",
    aiClassification: "already_answerable",
    aiRationale: "Looker HR Headcount dashboard has 'Hiring Plan vs Actual' toggle with departmental filters.",
    matchedAsset: {
      id: "dash-hr-hiring",
      name: "HR Headcount & Hiring Velocity",
      tab: "Department Variance",
      url: "https://looker.internal.company.com/dashboards/hr-org#budget"
    },
    effortHours: 0.5,
    priorityScore: 42,
    createdAt: "2026-10-28 04:15 PM",
    slaRemainingHours: 120,
    isOverdue: false
  },
  {
    id: "REQ-015",
    title: "Stream real-time fraud scoring API payload to Snowflake for model re-training",
    requester: "David Kim (Data Eng)",
    department: "Data Engineering",
    urgency: "P2 - High",
    deadline: "2026-11-08",
    whyNeeded: "Retrain fraud classifier model with recent false positive feedback labels.",
    status: "in_progress",
    aiClassification: "needs_pipeline",
    aiRationale: "Requires Kafka Snowpipe streaming connector setup and bronze partitioning.",
    matchedAsset: null,
    effortHours: 18,
    priorityScore: 81,
    createdAt: "2026-10-29 01:10 PM",
    slaRemainingHours: 32,
    isOverdue: false
  }
];

export const costDataMonthly = [
  {
    month: "May 2026",
    totalSpend: 32400,
    queriesMillion: 8.2,
    costPerThousandQueries: 3.95,
    computeSpend: 21800,
    storageSpend: 7400,
    licenseSpend: 3200,
    wasteEstimate: 2100,
    snowflakeSpend: 17200,
    bigquerySpend: 8800,
    databricksSpend: 6400
  },
  {
    month: "Jun 2026",
    totalSpend: 35100,
    queriesMillion: 8.5,
    costPerThousandQueries: 4.12,
    computeSpend: 23600,
    storageSpend: 8100,
    licenseSpend: 3400,
    wasteEstimate: 2600,
    snowflakeSpend: 18900,
    bigquerySpend: 9400,
    databricksSpend: 6800
  },
  {
    month: "Jul 2026",
    totalSpend: 39800,
    queriesMillion: 8.8,
    costPerThousandQueries: 4.52,
    computeSpend: 27100,
    storageSpend: 9100,
    licenseSpend: 3600,
    wasteEstimate: 3900,
    snowflakeSpend: 21400,
    bigquerySpend: 10800,
    databricksSpend: 7600
  },
  {
    month: "Aug 2026",
    totalSpend: 44200,
    queriesMillion: 9.1,
    costPerThousandQueries: 4.85,
    computeSpend: 30400,
    storageSpend: 10100,
    licenseSpend: 3700,
    wasteEstimate: 5100,
    snowflakeSpend: 23800,
    bigquerySpend: 12200,
    databricksSpend: 8200
  },
  {
    month: "Sep 2026",
    totalSpend: 49500,
    queriesMillion: 9.3,
    costPerThousandQueries: 5.32,
    computeSpend: 34800,
    storageSpend: 10900,
    licenseSpend: 3800,
    wasteEstimate: 6400,
    snowflakeSpend: 26500,
    bigquerySpend: 13900,
    databricksSpend: 9100
  },
  {
    month: "Oct 2026",
    totalSpend: 54800,
    queriesMillion: 9.6,
    costPerThousandQueries: 5.71,
    computeSpend: 38900,
    storageSpend: 11900,
    licenseSpend: 4000,
    wasteEstimate: 7820,
    snowflakeSpend: 28500,
    bigquerySpend: 15300,
    databricksSpend: 11000
  }
];

export const spendBreakdown = {
  byTeam: [
    { name: "Data & Platform Eng", spend: 19200, percentage: 35, color: "#3b82f6" },
    { name: "Sales Operations", spend: 11500, percentage: 21, color: "#10b981" },
    { name: "Growth Marketing", spend: 9800, percentage: 18, color: "#f59e0b" },
    { name: "Product Analytics", spend: 8100, percentage: 15, color: "#8b5cf6" },
    { name: "Finance & Exec", spend: 6200, percentage: 11, color: "#ec4899" }
  ],
  byWarehouse: [
    { name: "Snowflake Enterprise", spend: 28500, percentage: 52, color: "#2563eb", icon: "Snowflake" },
    { name: "Google BigQuery", spend: 15300, percentage: 28, color: "#059669", icon: "Database" },
    { name: "Databricks ML & Lakehouse", spend: 11000, percentage: 20, color: "#d97706", icon: "Cpu" }
  ],
  byStorage: [
    { name: "Snowflake Table Storage (Active)", sizeTB: 48.2, monthlyCost: 4820 },
    { name: "Snowflake Time Travel & Failsafe", sizeTB: 24.5, monthlyCost: 2450 },
    { name: "AWS S3 / GCS Data Lake (Hot)", sizeTB: 110.4, monthlyCost: 2540 },
    { name: "AWS S3 Glacier Archive (Cold)", sizeTB: 340.0, monthlyCost: 1360 }
  ]
};

export const wasteRecommendations = [
  {
    id: "rec-001",
    title: "Downsize Over-provisioned Snowflake Warehouse",
    category: "Compute Waste",
    asset: "BI_ANALYTICS_XL Warehouse",
    currentMonthlyCost: 4600,
    projectedMonthlySavings: 3800,
    effort: "Immediate (1-click)",
    risk: "Zero Risk",
    description: "The BI_ANALYTICS_XL warehouse runs 24/7 with an average CPU utilization of only 6.8%. During 80% of operating hours, 0 active queries are queued. Downsizing to Medium with 5-minute auto-suspend will save $3,800/mo with zero impact on dashboard response times.",
    status: "pending", // 'pending' | 'approved' | 'dismissed'
    actionLabel: "Apply Auto-Suspend & Downsize to M",
    appliedDate: null
  },
  {
    id: "rec-002",
    title: "Decommission Zombie Dashboard Refresh",
    category: "Unused Dashboard",
    asset: "Legacy Q1 Spiff Leaderboard (Tableau)",
    currentMonthlyCost: 920,
    projectedMonthlySavings: 920,
    effort: "Immediate",
    risk: "Zero Risk",
    description: "This dashboard executes hourly full-table scans across 85M rows on Snowflake, costing $920/mo. Access logs confirm 0 views from any user in the last 94 days. Pausing scheduled extracts will immediately eliminate this recurring cost.",
    status: "pending",
    actionLabel: "Pause Scheduled Extract",
    appliedDate: null
  },
  {
    id: "rec-003",
    title: "Archive 3.8 TB of Untouched Staging Tables",
    category: "Storage Waste",
    asset: "analytics_scratch.temp_event_archive_2024_02",
    currentMonthlyCost: 1450,
    projectedMonthlySavings: 1450,
    effort: "Low (Automated)",
    risk: "Low Risk",
    description: "Table has not been queried since May 2026. Transitioning from Snowflake active storage ($23/TB) to S3 Glacier Deep Archive ($1/TB) or dropping scratch partitions will save $1,450 every month.",
    status: "pending",
    actionLabel: "Migrate Table to Glacier Archive",
    appliedDate: null
  },
  {
    id: "rec-004",
    title: "Consolidate Duplicate Salesforce Ingestion Pipelines",
    category: "Duplicate Pipeline",
    asset: "pipeline_sf_fivetran vs airflow_sf_sync_v2",
    currentMonthlyCost: 2100,
    projectedMonthlySavings: 1650,
    effort: "Medium",
    risk: "Low Risk",
    description: "Two separate ingestion jobs are syncing identical Opportunity and Contact records from Salesforce into two different raw schemas. Consolidating into the single official dbt silver model will reduce redundant connector fees and compute by $1,650/mo.",
    status: "pending",
    actionLabel: "Deprecate Legacy Airflow Sync",
    appliedDate: null
  }
];

export const topAttentionItems = [
  {
    id: "att-1",
    severity: "critical",
    category: "Pipeline Health",
    title: "Stripe Billing Sync Failed Overnight",
    detail: "Schema mismatch in stg_stripe__charges halted billing sync at 03:14 AM. Downstream Executive ARR Dashboard is stale.",
    linkTab: "pipelines",
    actionType: "inspect_failure",
    pipelineId: "pipe-stripe-billing",
    impact: "Impacts CEO, CFO, and Q4 Board report"
  },
  {
    id: "att-2",
    severity: "critical",
    category: "Dashboard Trust",
    title: "Executive Revenue & ARR Trust Score Crashed to 48/100",
    detail: "Trust score plummeted due to 14h data staleness, null charge records, and metric conflict.",
    linkTab: "dashboards",
    actionType: "view_trust",
    dashboardId: "dash-exec-revenue",
    impact: "Used by 48 C-Suite and VP stakeholders daily"
  },
  {
    id: "att-3",
    severity: "high",
    category: "Cost Waste",
    title: "Over-provisioned Snowflake Warehouse Wasting $3.8k/mo",
    detail: "BI_ANALYTICS_XL running at 6.8% average CPU utilization without auto-suspend enabled.",
    linkTab: "cost",
    actionType: "optimize_cost",
    recId: "rec-001",
    impact: "Spend grew 48% faster than query volume this quarter"
  },
  {
    id: "att-4",
    severity: "high",
    category: "Metric Governance",
    title: "Active 'Net ARR' Definition Conflict ($1.2M discrepancy)",
    detail: "Finance excludes pending dispute invoices while Sales CRM includes verbal commitments.",
    linkTab: "dashboards",
    actionType: "view_metric_glossary",
    metricId: "metric-net-arr",
    impact: "Creates boardroom misalignment on revenue pacing"
  },
  {
    id: "att-5",
    severity: "medium",
    category: "Request Queue",
    title: "Ticket REQ-008 (LinkedIn Ad Attribution) Breached SLA by 18h",
    detail: "Waiting in Review stage due to pending QA on currency normalization model.",
    linkTab: "requests",
    actionType: "view_ticket",
    ticketId: "REQ-008",
    impact: "Performance marketing team blocked on holiday spend plan"
  }
];

export const copilotKnowledge = [
  {
    keywords: ["why", "sales", "dashboard", "wrong", "broken", "discrepancy"],
    question: "Why is the sales dashboard wrong today?",
    answer: "The Sales Rep Performance dashboard is showing delayed data and a potential discrepancy due to two interrelated factors:\n\n1. **Pipeline Delay**: `pipeline_salesforce_crm_etl` suffered a 45-minute SLA delay this morning because the Salesforce REST API bulk rate limit reached 85% capacity.\n2. **Metric Definition Conflict**: The Sales dashboard currently calculates Quota Attainment including unclosed verbal commitments, whereas the canonical Finance model excludes disputed or unbilled ARR ($1.2M variance).\n\n**Recommended Fix**: Check the Pipeline Health tab to inspect the Salesforce sync logs, and enforce the standard semantic layer definition from the Metric Glossary."
  },
  {
    keywords: ["pipeline", "risk", "tonight", "fail", "prediction", "overnight"],
    question: "Which pipelines are at risk of failing tonight?",
    answer: "PlatformPulse's failure prediction model has flagged **3 pipelines** with elevated failure probability tonight:\n\n1. **`pipeline_marketing_adspend_attribution` (Risk: High)**: Meta Graph API v18.0 deprecation warnings and token refresh retries spiked 2x over normal.\n2. **`pipeline_netsuite_erp_reconciliation` (Risk: Medium)**: High memory pressure (peaked at 89% RAM capacity) and late upstream data from SuiteTalk.\n3. **`pipeline_databricks_churn_model` (Risk: High)**: High shuffle spill and driver CPU saturation (96%) caused by unpartitioned tenant tables.\n\n**Recommendation**: Check the Morning-After / Prediction view to apply preventative configuration patches before midnight runs."
  },
  {
    keywords: ["spend", "cost", "spike", "increase", "growing", "expensive"],
    question: "Where is our platform spend spiking most?",
    answer: "Over the last 6 months, total cloud data platform spend has risen from **$32.4k to $54.8k (+69%)**, while query volume only grew by **17%**.\n\nThe primary cost drivers are:\n1. **Snowflake Compute ($28.5k/mo, 52% of total)**: Specifically the `BI_ANALYTICS_XL` warehouse running 24/7 at only 6.8% average CPU utilization without auto-suspend ($3,800/mo waste).\n2. **Unused Table Storage ($1,450/mo)**: 3.8 TB of stale scratch tables unaccessed for >120 days.\n3. **Zombie Dashboards ($920/mo)**: Legacy Tableau dashboards refreshing hourly with zero active viewers in 90 days.\n\n**Action**: 4 one-click recommendations in the Cost Optimizer tab can immediately reclaim **$7,820 / month**."
  },
  {
    keywords: ["churn", "existing", "dashboard", "renewal", "retention"],
    question: "Is there already a dashboard for customer churn and renewal rates?",
    answer: "Yes! You do not need to build a new pipeline. The **'Customer Success Health & Churn Risk'** dashboard is currently active with an **88/100 Trust Score**.\n\n- **Owner**: David Kim (Data Engineering)\n- **Refresh**: Synced 45 minutes ago\n- **Features**: Includes cohort churn breakdowns, account health scoring, predictive churn risk powered by Databricks, and Zendesk ticket correlation.\n\n**Direct Link**: Available in the Dashboard Trust tab or under request ticket REQ-001."
  }
];
