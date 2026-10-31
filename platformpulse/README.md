# PlatformPulse — Data & IT Control Tower

**PlatformPulse** is an enterprise-grade control tower web application designed for internal data and IT teams. It tackles the four persistent failure modes of modern data operations:
1. **Pipelines that fail overnight without warning**
2. **Dashboards the business no longer trusts**
3. **Data requests that queue for weeks**
4. **Platform cost growing faster than usage**

---

## 🚀 Live Demo & Key Features

### 1. Control Tower Overview (Home)
- **One-Sentence Value Prop**: Unified observability & governance control tower connecting pipeline health, dashboard trust, request triage, and platform cost into one synchronized operating picture.
- **4 Real-Time KPI Cards**: Pipelines failed in 24h, Average Dashboard Trust Score, Median Request Wait Time, and Cost-per-1k-Queries Trend.
- **"Needs Attention Today"**: Ranked top 5 cross-module critical risks with direct resolution buttons.
- **PlatformPulse AI Copilot**: Natural-language assistant answering questions like *"Why is the sales dashboard wrong today?"* or *"Which pipelines are at risk tonight?"* using live telemetry.
- **Cross-System Blast Radius Map**: Interactive visual diagram showing real-time data flow from raw ingest to semantic marts, dashboards, and cloud bills.

### 2. Pipeline Health & Failure Prediction
- **14 Pre-Seeded Pipelines**: Covering Bronze, Silver, Gold, and ML layers with live run status, duration vs. SLA, retry counts, and owners.
- **Failure Prediction Model**: Risk scores (*Low, Medium, High, Critical*) flagging pipelines with rising runtimes, API throttling, or memory saturation.
- **Morning-After View**: Isolated "What broke overnight" incident box with probable root causes (e.g. Stripe API schema drift `billing_country_iso2`) and suggested dbt hotfix patches.
- **Alert Rules & Simulated Slack/Email Modal**: Realistic `#data-incidents` Slack notification card with PagerDuty ack, log inspector, and hotfix dispatch.
- **Terminal Run Logs Inspector**: In-browser terminal view with timestamped execution logs and error stack traces.

### 3. Dashboard Trust Score & Metric Governance
- **8 Pre-Seeded Dashboards**: Spanning Executive ARR, Sales Rep Quotas, Product DAU, Marketing ROI, CS Churn, Supply Chain, and Platform Latency.
- **0–100 Trust Score**: Synthesized from 5 concrete dimensions: Data Freshness, Pipeline Reliability, Schema Stability, Data Quality / Null Checks, and Metric Consistency.
- **Visible Status Badges**: *Trusted (≥85)*, *Use with caution (60–84)*, and *Stale / High Risk (<60)*.
- **Drill-Down Modal**: In-depth audit reports displaying upstream dependencies, recent null spikes, and anomaly alerts.
- **Metric Glossary & KPI Conflict Detector**: Highlights semantic discrepancies across dashboards (e.g., $1.2M variance in *Net ARR* between Finance and Sales CRM, 38% difference in *Active Users*) with one-click semantic layer standardization.

### 4. Data Request Queue & AI Triage
- **Business Intake Form**: Fields for business objective, urgency (P1 to P4), target deadline, and department.
- **AI Triage Engine**: Auto-classifies requests into:
  - *Already Answerable*: Recommends existing trusted dashboards with live previews to deflect unnecessary pipeline building.
  - *Quick Query (<2h)*: Direct warehouse ad-hoc query export.
  - *Needs New Pipeline*: Complex ETL/data modeling scoped with story points and hours.
- **5-Column Kanban Board**: Backlog, In Triage, In Progress, QA / Review, Delivered.
- **Wait-Time Analytics**: SLA countdown timers, overdue breach alerts, and bottleneck detection banners.

### 5. Platform Cost Optimizer & Waste Governance
- **Cost vs. Usage Divergence (Recharts)**: 6-month historical trend showing spend climbing 69% while queries grew only 17%.
- **Multi-Dimensional Breakdown**: Slice spend by warehouse engine (*Snowflake 52%, BigQuery 28%, Databricks 20%*), business teams, and storage tiers (*Active Hot vs. Glacier Cold*).
- **Automated Waste Detection**: Identifies over-provisioned compute (`BI_ANALYTICS_XL`), zombie dashboards (0 views in 94 days), untouched staging tables, and duplicate pipelines.
- **Interactive Recommendation Cards**: One-click *"Approve Optimization"* and *"Dismiss"* actions that dynamically update the **Total Realized Monthly Savings** counter ($7,820/mo total waste).

### 6. Interactive Demo Scenario ("Run Demo Scenario")
- **One-Click Simulation**: Triggers the overnight disaster and demonstrates the cross-module cascade:
  1. 03:14 AM — `pipeline_stripe_billing_sync` fails on schema drift.
  2. 03:16 AM — Downstream Executive Revenue Trust Score drops from 94 to 48 (*Stale*).
  3. 03:17 AM — P1 Slack incident alert fires to `#data-incidents`.
  4. 07:45 AM — Finance team flags issue; auto-ticket REQ-004 is queued with priority score 96.
  5. 08:00 AM — Cost impact and wasted compute tracked in Cost Optimizer.
- **One-Click Hotfix**: Heals the pipeline, restores trust to 96/100, closes the incident ticket, and triggers celebratory confetti!

---

## 🛠 Tech Stack
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS with seamless Dark and Light mode
- **Charts**: Recharts (Composed Spend vs. Usage, Multi-Bar, Donut)
- **Icons**: Lucide React
- **Delight**: Canvas Confetti

---

## 🏃 Quick Start
```bash
cd platformpulse
npm install
npm run dev
```
Open [http://127.0.0.1:5173/](http://127.0.0.1:5173/) in your browser.
