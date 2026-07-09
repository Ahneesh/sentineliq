# ADR-002: Enterprise Data Profiling Engine

## Status
Accepted

## Context
SentinelIQ ingestion must understand data quality before surveillance detectors run.

## Decision
Every CSV upload is profiled immediately. The profile stores row counts, column counts, inferred types, null rates, duplicate rows, quality score and column-level statistics.

## Consequences
This creates a reusable foundation for future data quality rules, data lineage, detector readiness checks and AI-generated upload summaries.
