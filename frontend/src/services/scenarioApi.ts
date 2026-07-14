import api from "./apiClient";
import type { ScenarioDetail, ScenarioMetrics, ScenarioSummary } from "../types/scenario";

export async function listScenarios(params?: { search?: string; status?: string; risk_level?: string }) {
  const response = await api.get<ScenarioSummary[]>("/scenarios", { params });
  return response.data;
}

export async function getScenario(id: number) {
  const response = await api.get<ScenarioDetail>(`/scenarios/${id}`);
  return response.data;
}

export async function getScenarioMetrics() {
  const response = await api.get<ScenarioMetrics>("/scenarios/metrics");
  return response.data;
}

export async function updateScenarioStatus(id: number, status: string, reason: string) {
  const response = await api.patch<ScenarioDetail>(`/scenarios/${id}/status`, {
    status,
    reason,
    changed_by: "local_user",
  });
  return response.data;
}
