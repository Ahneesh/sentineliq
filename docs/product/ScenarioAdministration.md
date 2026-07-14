# Scenario Administration

SentinelIQ Scenario Administration governs the knowledge and configuration required to operate surveillance scenarios.

## Lifecycle

`DRAFT → IN_REVIEW → APPROVED → PRODUCTION → RETIRED`

## Scenario knowledge model

Each scenario records:

- identity and ownership;
- business objective;
- regulatory basis;
- detection-logic description;
- configurable parameters and sensitivity notes;
- required and optional datasets;
- quality expectations;
- asset-class, regional and venue applicability;
- known false positives;
- investigation guidance;
- audit history.

## Governance

The v0.4.0 lifecycle provides the foundation for maker-checker governance. Authentication, roles, approval entitlements, deployment promotion and rollback will be added incrementally.

## Confidentiality

Scenario content in the repository must be independently authored and generic. Proprietary vendor documentation, employer configurations, client data and confidential thresholds must not be copied into SentinelIQ.
