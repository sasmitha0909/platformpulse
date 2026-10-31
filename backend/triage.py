"""
PlatformPulse AI & Heuristic Request Triage Engine
Classifies incoming business data requests into:
1. 'already_answerable' (Matches existing trusted dashboard to prevent redundant pipeline building)
2. 'quick_query' (< 2 hours, ad-hoc SQL export from warehouse)
3. 'needs_pipeline' (Full engineering project: ETL connector, dbt models, semantic layer)
"""

from typing import Dict, Any, Optional
from database import db

def triage_request(title: str, why_needed: str, urgency: str, department: str) -> Dict[str, Any]:
    text = f"{title} {why_needed} {department}".lower()
    
    # Fetch active dashboards from Exasol / DB
    dashboards = db.query("SELECT dashboard_id, name, department, bi_tool, url FROM dashboards")
    
    # 1. Similarity & Keyword matching against existing dashboard assets
    matched_dash = None
    if any(k in text for k in ["churn", "retention", "cohort", "csat", "nps"]):
        matched_dash = next((d for d in dashboards if d["dashboard_id"] == "dash-cs-churn"), None)
    elif any(k in text for k in ["quota", "sales rep", "attainment", "pipeline deal", "closed won"]):
        matched_dash = next((d for d in dashboards if d["dashboard_id"] == "dash-sales-quota"), None)
    elif any(k in text for k in ["active users", "dau", "mau", "feature adoption", "session"]):
        matched_dash = next((d for d in dashboards if d["dashboard_id"] == "dash-product-dau"), None)
    elif any(k in text for k in ["ad spend", "cac", "attribution", "marketing roi", "ad campaign"]):
        matched_dash = next((d for d in dashboards if d["dashboard_id"] == "dash-marketing-roi"), None)
    elif any(k in text for k in ["inventory", "warehouse", "sku", "supply chain", "logistics"]):
        matched_dash = next((d for d in dashboards if d["dashboard_id"] == "dash-supply-chain"), None)
    elif any(k in text for k in ["headcount", "hiring", "org chart", "employee"]):
        matched_dash = next((d for d in dashboards if d["dashboard_id"] == "dash-hr-hiring"), None)
    elif any(k in text for k in ["revenue", "arr", "mrr", "board deck", "financial"]):
        matched_dash = next((d for d in dashboards if d["dashboard_id"] == "dash-exec-revenue"), None)

    # 2. Classification
    if matched_dash and not any(k in text for k in ["new pipeline", "build ingestion", "integrate api", "kafka", "webhook"]):
        classification = "already_answerable"
        rationale = f"Matched with existing trusted dashboard '{matched_dash['name']}'. The requested metric is already modeled and certified in the semantic catalog."
        matched_id = matched_dash["dashboard_id"]
        effort = 0.5
    elif any(k in text for k in ["export", "csv", "query", "list of", "one-off", "ad-hoc", "dump", "extract"]):
        classification = "quick_query"
        rationale = "Direct analytical query against existing staging/marts tables. Can be extracted via SQL without creating new pipelines."
        matched_id = None
        effort = 1.5
    else:
        classification = "needs_pipeline"
        rationale = "Requires new pipeline ingestion, schema modeling, staging dbt models, and SLA monitoring."
        matched_id = None
        effort = 24.0

    # 3. Urgency and Priority scoring formula
    urgency_mult = 4 if urgency.startswith("P1") else 3 if urgency.startswith("P2") else 2 if urgency.startswith("P3") else 1
    priority = int(min(99, max(25, urgency_mult * 25 - effort * 0.4 + 20)))
    sla_hours = 12 if urgency.startswith("P1") else 24 if urgency.startswith("P2") else 48 if urgency.startswith("P3") else 96

    return {
        "classification": classification,
        "rationale": rationale,
        "matched_dashboard_id": matched_id,
        "effort_hours": effort,
        "priority_score": priority,
        "sla_hours": sla_hours
    }
