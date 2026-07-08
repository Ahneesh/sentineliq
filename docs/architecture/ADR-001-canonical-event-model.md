# ADR-001: Canonical Event Model for SentinelIQ Data Platform

## Status
Accepted

## Context
Trade surveillance cannot rely on uploaded CSV structures directly. Future versions of SentinelIQ must support CSV, FIX, Kafka, REST APIs, S3/object storage, and database connectors. Each source may represent orders, cancellations, amendments and executions differently.

## Decision
SentinelIQ will convert source data into canonical market events before detection. The upload hub is therefore not merely a file-upload feature; it is the first interface into a canonical event platform.

Initial canonical domains:

- Orders
- Order events
- Executions
- Trades
- Market data
- Reference data
- Upload lineage

## Consequences
Positive:

- Detectors can operate on a stable model.
- New connectors can be added without rewriting surveillance logic.
- Upload lineage is preserved for audit and investigation.

Trade-offs:

- More upfront modelling effort.
- CSV ingestion requires schema validation and mapping.

## Notes
Feature Pack 3.1.1 implements upload metadata, dataset catalog and CSV validation. Full canonical order/trade persistence arrives in later packs.
