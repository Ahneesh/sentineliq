# ADR-005: Configuration-driven surveillance scenarios

## Status

Accepted

## Context

Hard-coded surveillance logic requires engineering releases for threshold, scope and lifecycle changes. Enterprise surveillance teams need governance, traceability and controlled configuration.

## Decision

SentinelIQ models a scenario as a first-class domain object containing business purpose, regulatory context, applicability, data requirements, parameters, detection-logic metadata, operational guidance and audit history.

## Consequences

- Scenario administration is separated from rule execution.
- Business configuration can evolve without changing detector source code.
- Every lifecycle change can be audited.
- Future AI capabilities can explain structured scenario knowledge rather than relying only on free text.
- Production deployment will require RBAC and maker-checker enforcement in a later release.
