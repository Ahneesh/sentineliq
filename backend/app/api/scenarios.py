from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.scenario import (
    ScenarioCreate,
    ScenarioDetailOut,
    ScenarioStatusUpdate,
    ScenarioSummaryOut,
)
from app.services.scenario_service import (
    create_scenario,
    get_scenario,
    list_scenarios,
    scenario_metrics,
    update_status,
)

router = APIRouter(prefix="/scenarios", tags=["scenarios"])


@router.get("", response_model=list[ScenarioSummaryOut])
def get_scenarios(
    search: str | None = Query(default=None),
    status: str | None = Query(default=None),
    risk_level: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    return list_scenarios(db, search=search, status=status, risk_level=risk_level)


@router.get("/metrics")
def get_scenario_metrics(db: Session = Depends(get_db)):
    return scenario_metrics(db)


@router.get("/{scenario_id}", response_model=ScenarioDetailOut)
def get_scenario_detail(scenario_id: int, db: Session = Depends(get_db)):
    scenario = get_scenario(db, scenario_id)
    if scenario is None:
        raise HTTPException(status_code=404, detail="Scenario not found")
    return scenario


@router.post("", response_model=ScenarioDetailOut, status_code=201)
def post_scenario(payload: ScenarioCreate, db: Session = Depends(get_db)):
    try:
        return create_scenario(db, payload)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=409, detail="Scenario code already exists") from exc


@router.patch("/{scenario_id}/status", response_model=ScenarioDetailOut)
def patch_scenario_status(
    scenario_id: int,
    payload: ScenarioStatusUpdate,
    db: Session = Depends(get_db),
):
    scenario = get_scenario(db, scenario_id)
    if scenario is None:
        raise HTTPException(status_code=404, detail="Scenario not found")
    try:
        return update_status(db, scenario, payload.status, payload.reason, payload.changed_by)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
