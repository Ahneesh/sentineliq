# PDR-001: Enterprise Upload Hub

## Status
Accepted

## Product Decision
The Data Platform screen should be positioned as an enterprise ingestion hub rather than a simple CSV uploader.

## Rationale
A CSV-only screen makes SentinelIQ feel like a prototype. An ingestion hub with CSV, FIX, Kafka, REST, S3 and database connectors communicates the longer-term enterprise architecture while still allowing CSV to be the first working connector.

## MVP Behaviour
- CSV connector is enabled.
- FIX, Kafka, REST, S3 and Database connectors are shown as coming soon.
- Upload history is visible.
- Validation findings are visible.
- Data Catalog and Data Explorer are introduced as platform concepts.

## User Value
Compliance and technology stakeholders can see how SentinelIQ will scale from local demos into bank-grade integrations.
