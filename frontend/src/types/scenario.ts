export type ScenarioStatus = "DRAFT" | "IN_REVIEW" | "APPROVED" | "PRODUCTION" | "RETIRED";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface ScenarioSummary {
  id: number;
  code: string;
  name: string;
  category: string;
  description: string;
  status: ScenarioStatus;
  risk_level: RiskLevel;
  version: string;
  owner: string;
  asset_classes: string[];
  regions: string[];
  is_enabled: boolean;
  updated_at: string;
}

export interface ScenarioParameter {
  id: number;
  key: string;
  label: string;
  value: string;
  value_type: string;
  unit: string | null;
  default_value: string | null;
  minimum_value: number | null;
  maximum_value: number | null;
  description: string;
  sensitivity_note: string;
  display_order: number;
}

export interface ScenarioDatasetRequirement {
  id: number;
  dataset_type: string;
  required: boolean;
  minimum_quality_score: number;
  rationale: string;
}

export interface ScenarioAudit {
  id: number;
  action: string;
  field_name: string | null;
  old_value: string | null;
  new_value: string | null;
  changed_by: string;
  reason: string;
  created_at: string;
}

export interface ScenarioDetail extends ScenarioSummary {
  business_purpose: string;
  regulatory_basis: string[];
  venues: string[];
  detection_logic: Record<string, string[]>;
  ai_explanation: string;
  known_false_positives: string[];
  investigation_guidance: string[];
  created_at: string;
  parameters: ScenarioParameter[];
  datasets: ScenarioDatasetRequirement[];
  audits: ScenarioAudit[];
}

export interface ScenarioMetrics {
  total: number;
  draft: number;
  in_review: number;
  approved: number;
  production: number;
  retired: number;
}
