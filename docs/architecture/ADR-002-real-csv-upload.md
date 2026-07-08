# ADR-002: Real CSV Upload Foundation

## Status
Accepted

## Context
SentinelIQ needs an ingestion foundation before detectors can run. CSV is implemented first because it allows rapid local testing with synthetic orders and trades.

## Decision
Implement a FastAPI `/api/uploads` endpoint that persists uploaded CSV files locally, counts rows, stores upload metadata in PostgreSQL, and exposes recent uploads to the React Data Platform page.

## Consequences
- The frontend can now upload files to the backend.
- Upload metadata is persisted across browser refreshes.
- This creates the base for later schema validation, canonical event generation, and detector execution.
