# PlatformPulse — Deployment & Reproduction Guide
### Hackathon Track: "The Work Behind the Work"

This document outlines step-by-step instructions to deploy, verify, and evaluate **PlatformPulse** using **Exasol Personal** as the single source of truth.

---

## 📋 Prerequisites
- **Python**: 3.10, 3.11, or 3.12 (`python --version`)
- **Node.js**: 18+ or 20+ (`node --version`)
- **Docker** (Optional, for running Exasol Personal locally): `docker --version`

---

## 🚀 Step 1: Environment Setup

Clone the repository and install dependencies:

```bash
# 1. Backend Python Dependencies
pip install -r backend/requirements.txt

# 2. Frontend React Dependencies
cd platformpulse
npm install
cd ..
```

---

## 🗄 Step 2: Database Initialization (Exasol Personal)

### Option A: Running Exasol Personal via Docker
Start the official Exasol container:
```bash
docker run --name platformpulse-exasol -p 8563:8563 --privileged -d exasol/docker-db:8
```
Wait approximately 30 seconds for Exasol's in-memory engine to initialize.

### Option B: Local Compatibility Engine
If Docker is not running on your host, simply skip to Step 3. The backend database manager (`backend/database.py`) automatically initializes the local embedded engine with equivalent schemas and SQL window functions.

---

## 🌱 Step 3: Run Seed Script

Execute `seed.py` to create the schema, analytical views, and 90 days of execution telemetry:

```bash
python backend/seed.py
```

Expected output:
```
======================================================================
[*] SEEDING PLATFORMPULSE EXASOL DATABASE
Engine: Exasol Personal (pyexasol) [or Local Compatibility Engine]
Target: localhost:8563
======================================================================
[+] Loaded 16 pipelines.
[+] Loaded 1440 pipeline execution runs across 90 days.
[+] Loaded 8 dashboards.
[+] Loaded 16 upstream lineage edges.
[+] Loaded 4 dashboard anomalies.
[+] Loaded 4 metric glossary definitions.
[+] Loaded 22 data requests across Kanban stages.
[+] Loaded 90 cost & usage records demonstrating spend growing faster than usage.
[+] Loaded 4 waste recommendations ($7,820/mo reclaimable).
======================================================================
[+] PLATFORMPULSE SEEDING COMPLETE!
======================================================================
```

---

## 🖥 Step 4: Launch Backend & Frontend Services

### Terminal 1: Backend API (FastAPI)
```bash
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
Verify the backend is live at:
- API Root: [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)
- Swagger Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### Terminal 2: Frontend UI (React + Tailwind + Recharts)
```bash
cd platformpulse
npm run dev -- --host 127.0.0.1 --port 5173
```
Open **[http://127.0.0.1:5173/](http://127.0.0.1:5173/)** in your browser.

---

## 🔍 Step 5: Hackathon Feature Verification Checklist

### 1. Control Tower Home Overview
- Verify the **One-Sentence Value Prop** at the top.
- Check the **4 KPI Cards**: `2 Pipelines Failed`, `Avg Trust 78/100`, `Median Wait 3.2 Days`, `Cost/1k Queries $5.71`.
- Inspect the **"Needs Attention Today"** top 5 ranked issues.
- Test the **PlatformPulse AI Copilot**: Click *"Why is the sales dashboard wrong today?"* to see live root cause diagnostic.

### 2. Pipeline Health Module
- Click the **Pipeline Health** tab.
- Observe the **Morning-After View**: *"What broke overnight"* card highlighting `pipeline_stripe_billing_sync` failure and suggested fix.
- Test **Inspect Logs**: Click "Inspect Logs" on any pipeline to view terminal execution logs and stack trace.
- Click **Alert Rules & Slack Preview**: Inspect the rich `#data-incidents` Slack card preview.

### 3. Dashboard Trust Score Module
- Click the **Dashboard Trust** tab.
- Observe the **Executive Revenue & ARR Overview** trust score at `48/100 (Stale)`.
- Click **Drill-Down** to inspect the 5 dimensions: Freshness (35%), Pipeline (42%), Schema (50%), Quality (55%), Metric (60%).
- Switch to the **Metric Glossary & Conflicts** tab: Review the `$1,240,000` discrepancy in Net ARR and click *"Enforce Standard Semantic Layer"*.

### 4. Data Request Queue Module
- Click the **Request Queue** tab.
- Review the **Wait-Time Analytics**: 3.2 days median, 38% deflection rate, bottleneck warning in 'In Progress'.
- Test the Kanban board: Move tickets between stages (*Backlog &rarr; In Triage &rarr; In Progress &rarr; Review &rarr; Delivered*).
- Click **Submit Data Request**: Type *"Need churn cohort report for enterprise tier"* and watch the AI triage preview match `Customer Success Health & Churn Risk` instantly!

### 5. Cost Optimizer Module
- Click the **Cost Optimizer** tab.
- Review the **Recharts Cost vs. Usage Divergence** chart showing spend growing +69% vs queries +17%.
- Switch between **Warehouse Engine**, **Business Team**, and **Storage Tier** breakdowns.
- Test 1-Click Action: Click **"Apply Auto-Suspend & Downsize to M"** on the `BI_ANALYTICS_XL` recommendation and verify the **Realized Monthly Savings** counter increases by `$3,800/mo`!

### 6. Interactive Demo Scenario ("⚡ Run Demo Scenario")
- Click the **"⚡ Run Demo Scenario"** button in the header.
- Watch the 5-phase chain reaction:
  1. *03:14 AM*: Pipeline fails on schema drift.
  2. *03:16 AM*: Dashboard trust drops to 48.
  3. *03:17 AM*: Slack P1 alert fires.
  4. *07:45 AM*: Incident ticket `REQ-004` is injected into queue.
  5. *08:00 AM*: Cost spillover tracked in Cost Optimizer.
- Click **"Apply 1-Click Fix"**: Watch the pipeline auto-heal, trust score restore to 96/100, ticket complete, and celebration confetti fire!

---

## 🧪 Step 6: Direct API Verification via cURL / PowerShell

```powershell
# Health check
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/health"

# Overview KPIs
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/overview"

# Trigger Demo Failure
Invoke-RestMethod -Method POST -Uri "http://127.0.0.1:8000/api/demo/run"

# Trigger Demo Fix
Invoke-RestMethod -Method POST -Uri "http://127.0.0.1:8000/api/demo/fix"

# Reset Demo
Invoke-RestMethod -Method POST -Uri "http://127.0.0.1:8000/api/demo/reset"
```
