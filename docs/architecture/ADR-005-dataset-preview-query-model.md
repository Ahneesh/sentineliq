# ADR-005: Dataset Preview Query Model

## Status
Accepted

## Decision

The first Dataset Explorer reads uploaded CSV files through a bounded backend preview service. Search, sorting and pagination are performed server-side, and responses are capped at 200 records per page.

## Rationale

- Prevents the browser from loading complete files.
- Provides a stable API contract for future DuckDB/Polars-backed exploration.
- Keeps the MVP compatible with the existing local object-storage design.

## Evolution

When datasets exceed the practical size of in-memory CSV inspection, the implementation will move behind the same API contract to DuckDB, Parquet and object storage without requiring frontend changes.
