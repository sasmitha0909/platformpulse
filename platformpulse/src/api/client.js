// PlatformPulse Backend API Client
// Connects React frontend to FastAPI + Exasol backend

const API_BASE = "http://127.0.0.1:8000/api";

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return await res.json();
  } catch (err) {
    return { status: "offline", error: err.message };
  }
}

export async function fetchOverview() {
  const res = await fetch(`${API_BASE}/overview`);
  if (!res.ok) throw new Error("Failed to fetch overview");
  return await res.json();
}

export async function fetchPipelines() {
  const res = await fetch(`${API_BASE}/pipelines`);
  if (!res.ok) throw new Error("Failed to fetch pipelines");
  return await res.json();
}

export async function fetchMorningAfter() {
  const res = await fetch(`${API_BASE}/pipelines/morning-after`);
  if (!res.ok) throw new Error("Failed to fetch morning-after failures");
  return await res.json();
}

export async function fetchPipelineLogs(pipelineId) {
  const res = await fetch(`${API_BASE}/pipelines/${pipelineId}/logs`);
  if (!res.ok) throw new Error("Failed to fetch pipeline logs");
  return await res.json();
}

export async function retryPipeline(pipelineId) {
  const res = await fetch(`${API_BASE}/pipelines/${pipelineId}/retry`, {
    method: "POST"
  });
  if (!res.ok) throw new Error("Failed to retry pipeline");
  return await res.json();
}

export async function fetchDashboards() {
  const res = await fetch(`${API_BASE}/dashboards`);
  if (!res.ok) throw new Error("Failed to fetch dashboards");
  return await res.json();
}

export async function fetchMetricGlossary() {
  const res = await fetch(`${API_BASE}/glossary`);
  if (!res.ok) throw new Error("Failed to fetch metric glossary");
  return await res.json();
}

export async function standardizeMetric(metricId) {
  const res = await fetch(`${API_BASE}/glossary/${metricId}/standardize`, {
    method: "POST"
  });
  if (!res.ok) throw new Error("Failed to standardize metric");
  return await res.json();
}

export async function fetchRequests() {
  const res = await fetch(`${API_BASE}/requests`);
  if (!res.ok) throw new Error("Failed to fetch requests");
  return await res.json();
}

export async function createRequest(payload) {
  const res = await fetch(`${API_BASE}/requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Failed to create request");
  return await res.json();
}

export async function updateRequestStatus(requestId, status) {
  const res = await fetch(`${API_BASE}/requests/${requestId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error("Failed to update request status");
  return await res.json();
}

export async function fetchCostDivergence() {
  const res = await fetch(`${API_BASE}/cost/divergence`);
  if (!res.ok) throw new Error("Failed to fetch cost divergence");
  return await res.json();
}

export async function fetchWasteRecommendations() {
  const res = await fetch(`${API_BASE}/cost/waste`);
  if (!res.ok) throw new Error("Failed to fetch waste recommendations");
  return await res.json();
}

export async function updateWasteAction(recId, action) {
  const res = await fetch(`${API_BASE}/cost/waste/${recId}/action`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action })
  });
  if (!res.ok) throw new Error("Failed to update waste recommendation");
  return await res.json();
}

export async function triggerDemoRun() {
  const res = await fetch(`${API_BASE}/demo/run`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to trigger demo run");
  return await res.json();
}

export async function triggerDemoFix() {
  const res = await fetch(`${API_BASE}/demo/fix`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to fix demo scenario");
  return await res.json();
}

export async function triggerDemoReset() {
  const res = await fetch(`${API_BASE}/demo/reset`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to reset demo scenario");
  return await res.json();
}

export async function askCopilot(query) {
  const res = await fetch(`${API_BASE}/copilot/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  });
  if (!res.ok) throw new Error("Failed to query copilot");
  return await res.json();
}
