# Changelog

## v0.3.3 — Engineering Hardening

### Added
- Alembic migration framework.
- Initial migration for `uploads` and `dataset_profiles`.
- Structured logging module.
- Backend health and upload model tests.
- GitHub Actions CI workflow.
- Ruff and Black configuration.
- Makefile for common developer commands.
- Engineering documentation for migrations.

### Changed
- Backend configuration made environment-driven.
- Database schema creation moved toward migration-first workflow.

### Fixed
- Prevents schema drift issues such as missing `uploads.file_name` after feature pack upgrades.
