from __future__ import annotations

from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Scenario(Base):
    __tablename__ = "scenarios"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    code: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    business_purpose: Mapped[str] = mapped_column(Text, nullable=False)
    regulatory_basis: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="DRAFT", nullable=False, index=True)
    risk_level: Mapped[str] = mapped_column(String(20), default="MEDIUM", nullable=False)
    version: Mapped[str] = mapped_column(String(20), default="1.0", nullable=False)
    owner: Mapped[str] = mapped_column(String(120), default="Market Surveillance", nullable=False)
    asset_classes: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    regions: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    venues: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    detection_logic: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    ai_explanation: Mapped[str] = mapped_column(Text, default="", nullable=False)
    known_false_positives: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    investigation_guidance: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    is_enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    parameters: Mapped[list["ScenarioParameter"]] = relationship(
        back_populates="scenario", cascade="all, delete-orphan", order_by="ScenarioParameter.display_order"
    )
    datasets: Mapped[list["ScenarioDatasetRequirement"]] = relationship(
        back_populates="scenario", cascade="all, delete-orphan"
    )
    audits: Mapped[list["ScenarioAudit"]] = relationship(
        back_populates="scenario", cascade="all, delete-orphan", order_by="ScenarioAudit.created_at.desc()"
    )


class ScenarioParameter(Base):
    __tablename__ = "scenario_parameters"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    scenario_id: Mapped[int] = mapped_column(ForeignKey("scenarios.id", ondelete="CASCADE"), nullable=False, index=True)
    key: Mapped[str] = mapped_column(String(100), nullable=False)
    label: Mapped[str] = mapped_column(String(150), nullable=False)
    value: Mapped[str] = mapped_column(String(255), nullable=False)
    value_type: Mapped[str] = mapped_column(String(30), default="number", nullable=False)
    unit: Mapped[str | None] = mapped_column(String(30), nullable=True)
    default_value: Mapped[str | None] = mapped_column(String(255), nullable=True)
    minimum_value: Mapped[float | None] = mapped_column(Float, nullable=True)
    maximum_value: Mapped[float | None] = mapped_column(Float, nullable=True)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    sensitivity_note: Mapped[str] = mapped_column(Text, default="", nullable=False)
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    scenario: Mapped[Scenario] = relationship(back_populates="parameters")


class ScenarioDatasetRequirement(Base):
    __tablename__ = "scenario_dataset_requirements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    scenario_id: Mapped[int] = mapped_column(ForeignKey("scenarios.id", ondelete="CASCADE"), nullable=False, index=True)
    dataset_type: Mapped[str] = mapped_column(String(100), nullable=False)
    required: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    minimum_quality_score: Mapped[int] = mapped_column(Integer, default=90, nullable=False)
    rationale: Mapped[str] = mapped_column(Text, default="", nullable=False)

    scenario: Mapped[Scenario] = relationship(back_populates="datasets")


class ScenarioAudit(Base):
    __tablename__ = "scenario_audits"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    scenario_id: Mapped[int] = mapped_column(ForeignKey("scenarios.id", ondelete="CASCADE"), nullable=False, index=True)
    action: Mapped[str] = mapped_column(String(100), nullable=False)
    field_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    old_value: Mapped[str | None] = mapped_column(Text, nullable=True)
    new_value: Mapped[str | None] = mapped_column(Text, nullable=True)
    changed_by: Mapped[str] = mapped_column(String(120), default="system", nullable=False)
    reason: Mapped[str] = mapped_column(Text, default="", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), nullable=False)

    scenario: Mapped[Scenario] = relationship(back_populates="audits")
