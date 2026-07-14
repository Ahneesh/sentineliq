from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class ScenarioParameterOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    key: str
    label: str
    value: str
    value_type: str
    unit: str | None
    default_value: str | None
    minimum_value: float | None
    maximum_value: float | None
    description: str
    sensitivity_note: str
    display_order: int


class ScenarioDatasetRequirementOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    dataset_type: str
    required: bool
    minimum_quality_score: int
    rationale: str


class ScenarioAuditOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    action: str
    field_name: str | None
    old_value: str | None
    new_value: str | None
    changed_by: str
    reason: str
    created_at: datetime


class ScenarioSummaryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    code: str
    name: str
    category: str
    description: str
    status: str
    risk_level: str
    version: str
    owner: str
    asset_classes: list[str]
    regions: list[str]
    is_enabled: bool
    updated_at: datetime


class ScenarioDetailOut(ScenarioSummaryOut):
    business_purpose: str
    regulatory_basis: list[str]
    venues: list[str]
    detection_logic: dict[str, Any]
    ai_explanation: str
    known_false_positives: list[str]
    investigation_guidance: list[str]
    created_at: datetime
    parameters: list[ScenarioParameterOut]
    datasets: list[ScenarioDatasetRequirementOut]
    audits: list[ScenarioAuditOut]


class ScenarioCreate(BaseModel):
    code: str = Field(min_length=3, max_length=50)
    name: str = Field(min_length=3, max_length=150)
    category: str
    description: str
    business_purpose: str
    regulatory_basis: list[str] = []
    risk_level: str = "MEDIUM"
    owner: str = "Market Surveillance"
    asset_classes: list[str] = []
    regions: list[str] = []
    venues: list[str] = []


class ScenarioStatusUpdate(BaseModel):
    status: str
    reason: str = ""
    changed_by: str = "local_user"
