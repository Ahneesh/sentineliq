from sqlalchemy import func
from sqlalchemy.orm import Session, selectinload

from app.models.scenario import Scenario, ScenarioAudit
from app.schemas.scenario import ScenarioCreate


VALID_STATUSES = {"DRAFT", "IN_REVIEW", "APPROVED", "PRODUCTION", "RETIRED"}


def list_scenarios(
    db: Session,
    *,
    search: str | None = None,
    status: str | None = None,
    risk_level: str | None = None,
) -> list[Scenario]:
    query = db.query(Scenario)
    if search:
        token = f"%{search.strip()}%"
        query = query.filter(
            (Scenario.name.ilike(token))
            | (Scenario.code.ilike(token))
            | (Scenario.description.ilike(token))
        )
    if status:
        query = query.filter(Scenario.status == status.upper())
    if risk_level:
        query = query.filter(Scenario.risk_level == risk_level.upper())
    return query.order_by(Scenario.name.asc()).all()


def get_scenario(db: Session, scenario_id: int) -> Scenario | None:
    return (
        db.query(Scenario)
        .options(
            selectinload(Scenario.parameters),
            selectinload(Scenario.datasets),
            selectinload(Scenario.audits),
        )
        .filter(Scenario.id == scenario_id)
        .first()
    )


def create_scenario(db: Session, payload: ScenarioCreate) -> Scenario:
    scenario = Scenario(
        **payload.model_dump(),
        status="DRAFT",
        version="1.0",
        detection_logic={"all": []},
        ai_explanation="AI explanation will be generated after the scenario logic is configured.",
        known_false_positives=[],
        investigation_guidance=[],
    )
    db.add(scenario)
    db.flush()
    db.add(
        ScenarioAudit(
            scenario_id=scenario.id,
            action="SCENARIO_CREATED",
            changed_by="local_user",
            reason="Scenario created in SentinelIQ administration.",
        )
    )
    db.commit()
    return get_scenario(db, scenario.id)  # type: ignore[return-value]


def update_status(db: Session, scenario: Scenario, status: str, reason: str, changed_by: str) -> Scenario:
    next_status = status.upper()
    if next_status not in VALID_STATUSES:
        raise ValueError(f"Unsupported scenario status: {next_status}")
    old_status = scenario.status
    scenario.status = next_status
    db.add(
        ScenarioAudit(
            scenario_id=scenario.id,
            action="STATUS_CHANGED",
            field_name="status",
            old_value=old_status,
            new_value=next_status,
            changed_by=changed_by,
            reason=reason,
        )
    )
    db.commit()
    return get_scenario(db, scenario.id)  # type: ignore[return-value]


def scenario_metrics(db: Session) -> dict[str, int]:
    total = db.query(func.count(Scenario.id)).scalar() or 0
    rows = db.query(Scenario.status, func.count(Scenario.id)).group_by(Scenario.status).all()
    metrics = {"total": total, "draft": 0, "in_review": 0, "approved": 0, "production": 0, "retired": 0}
    for status, count in rows:
        metrics[status.lower()] = count
    return metrics
