from app.services.scenario_service import VALID_STATUSES


def test_scenario_status_catalogue():
    assert "DRAFT" in VALID_STATUSES
    assert "PRODUCTION" in VALID_STATUSES
    assert "RETIRED" in VALID_STATUSES
