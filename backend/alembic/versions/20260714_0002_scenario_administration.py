"""add scenario administration

Revision ID: 20260714_0002
Revises: 20260708_0001
Create Date: 2026-07-14
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "20260714_0002"
down_revision: Union[str, None] = "20260708_0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "scenarios",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("code", sa.String(50), nullable=False, unique=True),
        sa.Column("name", sa.String(150), nullable=False),
        sa.Column("category", sa.String(100), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("business_purpose", sa.Text(), nullable=False),
        sa.Column("regulatory_basis", postgresql.JSONB(), nullable=False, server_default=sa.text("'[]'::jsonb")),
        sa.Column("status", sa.String(30), nullable=False, server_default="DRAFT"),
        sa.Column("risk_level", sa.String(20), nullable=False, server_default="MEDIUM"),
        sa.Column("version", sa.String(20), nullable=False, server_default="1.0"),
        sa.Column("owner", sa.String(120), nullable=False, server_default="Market Surveillance"),
        sa.Column("asset_classes", postgresql.JSONB(), nullable=False, server_default=sa.text("'[]'::jsonb")),
        sa.Column("regions", postgresql.JSONB(), nullable=False, server_default=sa.text("'[]'::jsonb")),
        sa.Column("venues", postgresql.JSONB(), nullable=False, server_default=sa.text("'[]'::jsonb")),
        sa.Column("detection_logic", postgresql.JSONB(), nullable=False, server_default=sa.text("'{}'::jsonb")),
        sa.Column("ai_explanation", sa.Text(), nullable=False, server_default=""),
        sa.Column("known_false_positives", postgresql.JSONB(), nullable=False, server_default=sa.text("'[]'::jsonb")),
        sa.Column("investigation_guidance", postgresql.JSONB(), nullable=False, server_default=sa.text("'[]'::jsonb")),
        sa.Column("is_enabled", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_scenarios_code", "scenarios", ["code"], unique=True)
    op.create_index("ix_scenarios_status", "scenarios", ["status"])

    op.create_table(
        "scenario_parameters",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("scenario_id", sa.Integer(), sa.ForeignKey("scenarios.id", ondelete="CASCADE"), nullable=False),
        sa.Column("key", sa.String(100), nullable=False),
        sa.Column("label", sa.String(150), nullable=False),
        sa.Column("value", sa.String(255), nullable=False),
        sa.Column("value_type", sa.String(30), nullable=False, server_default="number"),
        sa.Column("unit", sa.String(30), nullable=True),
        sa.Column("default_value", sa.String(255), nullable=True),
        sa.Column("minimum_value", sa.Float(), nullable=True),
        sa.Column("maximum_value", sa.Float(), nullable=True),
        sa.Column("description", sa.Text(), nullable=False, server_default=""),
        sa.Column("sensitivity_note", sa.Text(), nullable=False, server_default=""),
        sa.Column("display_order", sa.Integer(), nullable=False, server_default="0"),
    )
    op.create_index("ix_scenario_parameters_scenario_id", "scenario_parameters", ["scenario_id"])

    op.create_table(
        "scenario_dataset_requirements",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("scenario_id", sa.Integer(), sa.ForeignKey("scenarios.id", ondelete="CASCADE"), nullable=False),
        sa.Column("dataset_type", sa.String(100), nullable=False),
        sa.Column("required", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("minimum_quality_score", sa.Integer(), nullable=False, server_default="90"),
        sa.Column("rationale", sa.Text(), nullable=False, server_default=""),
    )
    op.create_index("ix_scenario_dataset_requirements_scenario_id", "scenario_dataset_requirements", ["scenario_id"])

    op.create_table(
        "scenario_audits",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("scenario_id", sa.Integer(), sa.ForeignKey("scenarios.id", ondelete="CASCADE"), nullable=False),
        sa.Column("action", sa.String(100), nullable=False),
        sa.Column("field_name", sa.String(100), nullable=True),
        sa.Column("old_value", sa.Text(), nullable=True),
        sa.Column("new_value", sa.Text(), nullable=True),
        sa.Column("changed_by", sa.String(120), nullable=False, server_default="system"),
        sa.Column("reason", sa.Text(), nullable=False, server_default=""),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_scenario_audits_scenario_id", "scenario_audits", ["scenario_id"])

    scenarios = sa.table(
        "scenarios",
        sa.column("id", sa.Integer), sa.column("code", sa.String), sa.column("name", sa.String),
        sa.column("category", sa.String), sa.column("description", sa.Text), sa.column("business_purpose", sa.Text),
        sa.column("regulatory_basis", postgresql.JSONB), sa.column("status", sa.String), sa.column("risk_level", sa.String),
        sa.column("version", sa.String), sa.column("owner", sa.String), sa.column("asset_classes", postgresql.JSONB),
        sa.column("regions", postgresql.JSONB), sa.column("venues", postgresql.JSONB), sa.column("detection_logic", postgresql.JSONB),
        sa.column("ai_explanation", sa.Text), sa.column("known_false_positives", postgresql.JSONB),
        sa.column("investigation_guidance", postgresql.JSONB), sa.column("is_enabled", sa.Boolean),
    )
    seed = [
        {"id": 1, "code": "SPF-001", "name": "Spoofing", "category": "Market Manipulation", "description": "Detects large visible orders that are rapidly cancelled while activity on the opposite side may benefit from the resulting market impression.", "business_purpose": "Identify order-book behaviour that may create a false or misleading impression of supply, demand or liquidity.", "regulatory_basis": ["UK MAR Article 12", "EU MAR Article 12"], "status": "PRODUCTION", "risk_level": "HIGH", "version": "1.0", "owner": "Market Surveillance", "asset_classes": ["Equities", "Futures"], "regions": ["UK", "Europe"], "venues": ["LSE", "Euronext", "Cboe Europe"], "detection_logic": {"all": ["large_visible_order", "rapid_cancellation", "low_execution_ratio", "opposite_side_benefit"]}, "ai_explanation": "Looks for large orders displayed in the book, cancelled before meaningful execution, together with repeated behaviour or beneficial trading on the opposite side.", "known_false_positives": ["Legitimate liquidity provision", "Rapid repricing during volatility", "Exchange or gateway latency"], "investigation_guidance": ["Review the full order-event timeline", "Compare displayed and executed quantity", "Inspect opposite-side executions", "Assess repeated behaviour across instruments and venues"], "is_enabled": True},
        {"id": 2, "code": "LAY-001", "name": "Layering", "category": "Market Manipulation", "description": "Detects multiple non-bona-fide orders placed at different price levels to influence the order book.", "business_purpose": "Identify layered order-book pressure followed by cancellation and trading on the opposite side.", "regulatory_basis": ["UK MAR Article 12", "EU MAR Article 12"], "status": "APPROVED", "risk_level": "HIGH", "version": "1.0", "owner": "Market Surveillance", "asset_classes": ["Equities", "Futures"], "regions": ["UK", "Europe", "US"], "venues": [], "detection_logic": {"all": ["multiple_price_levels", "same_side_pressure", "cancellation_cluster", "opposite_side_execution"]}, "ai_explanation": "Looks for several orders at progressively different prices that create apparent depth and are then cancelled when the trader executes on the opposite side.", "known_false_positives": ["Algorithmic slicing", "Market making inventory management"], "investigation_guidance": ["Reconstruct price-level sequence", "Compare order ownership", "Review timing of opposite-side fills"], "is_enabled": True},
        {"id": 3, "code": "WASH-001", "name": "Wash Trading", "category": "Market Manipulation", "description": "Detects trades where beneficial ownership or economic exposure may not materially change.", "business_purpose": "Identify potentially artificial volume or price formation caused by self-matching or coordinated accounts.", "regulatory_basis": ["UK MAR Article 12", "EU MAR Article 12"], "status": "PRODUCTION", "risk_level": "HIGH", "version": "1.0", "owner": "Market Surveillance", "asset_classes": ["Equities", "Fixed Income", "Crypto"], "regions": ["Global"], "venues": [], "detection_logic": {"all": ["matched_instrument", "matched_quantity", "matched_price", "common_ownership_or_control"]}, "ai_explanation": "Compares both sides of matched trades and relationship data to identify cases where economic ownership may not have changed.", "known_false_positives": ["Agency crosses", "Fund rebalancing", "Internal transfers permitted by policy"], "investigation_guidance": ["Confirm account relationships", "Review capacity and client identifiers", "Assess economic purpose"], "is_enabled": True},
        {"id": 4, "code": "MOM-001", "name": "Momentum Ignition", "category": "Market Manipulation", "description": "Detects aggressive trading intended to trigger or amplify a price move before reversing or monetising the position.", "business_purpose": "Identify bursts of trading or messaging that may provoke other market participants and create artificial momentum.", "regulatory_basis": ["UK MAR Article 12", "EU MAR Article 12"], "status": "IN_REVIEW", "risk_level": "MEDIUM", "version": "0.9", "owner": "Market Surveillance", "asset_classes": ["Equities", "Futures", "FX"], "regions": ["Global"], "venues": [], "detection_logic": {"all": ["aggressive_trade_burst", "price_acceleration", "subsequent_reversal_or_profit"]}, "ai_explanation": "Looks for concentrated aggressive activity followed by a rapid market move and a subsequent reduction or reversal of exposure.", "known_false_positives": ["News-driven repricing", "Legitimate stop execution", "Large client flow"], "investigation_guidance": ["Check news and market events", "Review trader position before and after", "Compare participation rate"], "is_enabled": True},
        {"id": 5, "code": "MTC-001", "name": "Marking the Close", "category": "Market Manipulation", "description": "Detects trading near a reference-price calculation window that may influence the official close.", "business_purpose": "Identify activity designed to move a closing or valuation benchmark.", "regulatory_basis": ["UK MAR Article 12", "EU MAR Article 12"], "status": "DRAFT", "risk_level": "HIGH", "version": "0.7", "owner": "Market Surveillance", "asset_classes": ["Equities", "Futures"], "regions": ["Global"], "venues": [], "detection_logic": {"all": ["close_window_activity", "price_impact", "position_or_valuation_benefit"]}, "ai_explanation": "Focuses on unusual trading concentration and price impact during an exchange closing or benchmark window.", "known_false_positives": ["Index rebalancing", "Benchmark execution mandates", "Closing auction participation"], "investigation_guidance": ["Check benchmark mandate", "Review auction imbalance", "Assess valuation benefit"], "is_enabled": True},
    ]
    op.bulk_insert(scenarios, seed)

    params = sa.table("scenario_parameters", sa.column("scenario_id", sa.Integer), sa.column("key", sa.String), sa.column("label", sa.String), sa.column("value", sa.String), sa.column("value_type", sa.String), sa.column("unit", sa.String), sa.column("default_value", sa.String), sa.column("minimum_value", sa.Float), sa.column("maximum_value", sa.Float), sa.column("description", sa.Text), sa.column("sensitivity_note", sa.Text), sa.column("display_order", sa.Integer))
    op.bulk_insert(params, [
        {"scenario_id": 1, "key": "minimum_order_value", "label": "Minimum Order Value", "value": "250000", "value_type": "number", "unit": "GBP", "default_value": "250000", "minimum_value": 0, "maximum_value": None, "description": "Minimum displayed notional considered significant.", "sensitivity_note": "Lower values increase coverage and alert volume.", "display_order": 1},
        {"scenario_id": 1, "key": "maximum_cancel_latency", "label": "Maximum Cancellation Latency", "value": "500", "value_type": "number", "unit": "ms", "default_value": "1000", "minimum_value": 1, "maximum_value": 60000, "description": "Maximum time between entry and cancellation for the rapid-cancel condition.", "sensitivity_note": "Lower values focus on more immediate cancellations.", "display_order": 2},
        {"scenario_id": 1, "key": "maximum_execution_ratio", "label": "Maximum Execution Ratio", "value": "5", "value_type": "number", "unit": "%", "default_value": "10", "minimum_value": 0, "maximum_value": 100, "description": "Maximum proportion executed before cancellation.", "sensitivity_note": "Higher values may capture partially filled bona-fide orders.", "display_order": 3},
        {"scenario_id": 1, "key": "minimum_repeat_count", "label": "Minimum Repeat Count", "value": "5", "value_type": "integer", "unit": "events", "default_value": "5", "minimum_value": 1, "maximum_value": 1000, "description": "Minimum number of qualifying sequences in the lookback window.", "sensitivity_note": "Lower values increase single-event sensitivity.", "display_order": 4},
        {"scenario_id": 1, "key": "lookback_window", "label": "Lookback Window", "value": "15", "value_type": "number", "unit": "seconds", "default_value": "15", "minimum_value": 1, "maximum_value": 3600, "description": "Window used to aggregate repeated behaviour.", "sensitivity_note": "Longer windows may combine unrelated activity.", "display_order": 5},
    ])

    reqs = sa.table("scenario_dataset_requirements", sa.column("scenario_id", sa.Integer), sa.column("dataset_type", sa.String), sa.column("required", sa.Boolean), sa.column("minimum_quality_score", sa.Integer), sa.column("rationale", sa.Text))
    op.bulk_insert(reqs, [
        {"scenario_id": 1, "dataset_type": "Orders", "required": True, "minimum_quality_score": 95, "rationale": "Provides original size, side, price and ownership."},
        {"scenario_id": 1, "dataset_type": "Order Events", "required": True, "minimum_quality_score": 95, "rationale": "Required to reconstruct modifications and cancellations."},
        {"scenario_id": 1, "dataset_type": "Executions", "required": True, "minimum_quality_score": 90, "rationale": "Measures executed quantity and opposite-side benefit."},
        {"scenario_id": 1, "dataset_type": "Market Data", "required": True, "minimum_quality_score": 90, "rationale": "Measures order-book context and price response."},
        {"scenario_id": 1, "dataset_type": "Trader Reference", "required": False, "minimum_quality_score": 85, "rationale": "Supports ownership, desk and behavioural context."},
    ])

    audits = sa.table("scenario_audits", sa.column("scenario_id", sa.Integer), sa.column("action", sa.String), sa.column("field_name", sa.String), sa.column("old_value", sa.Text), sa.column("new_value", sa.Text), sa.column("changed_by", sa.String), sa.column("reason", sa.Text))
    op.bulk_insert(audits, [
        {"scenario_id": 1, "action": "SCENARIO_SEEDED", "field_name": None, "old_value": None, "new_value": "1.0", "changed_by": "system", "reason": "Initial independently authored SentinelIQ scenario configuration."},
        {"scenario_id": 1, "action": "STATUS_CHANGED", "field_name": "status", "old_value": "APPROVED", "new_value": "PRODUCTION", "changed_by": "Surveillance Manager", "reason": "Initial production catalogue seed."},
    ])


def downgrade() -> None:
    op.drop_index("ix_scenario_audits_scenario_id", table_name="scenario_audits")
    op.drop_table("scenario_audits")
    op.drop_index("ix_scenario_dataset_requirements_scenario_id", table_name="scenario_dataset_requirements")
    op.drop_table("scenario_dataset_requirements")
    op.drop_index("ix_scenario_parameters_scenario_id", table_name="scenario_parameters")
    op.drop_table("scenario_parameters")
    op.drop_index("ix_scenarios_status", table_name="scenarios")
    op.drop_index("ix_scenarios_code", table_name="scenarios")
    op.drop_table("scenarios")
