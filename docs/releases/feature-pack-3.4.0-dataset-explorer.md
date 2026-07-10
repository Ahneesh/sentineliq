# Feature Pack 3.4.0 — Enterprise Dataset Explorer

## Delivered

- Dataset preview API backed by stored CSV uploads.
- Server-side pagination with a maximum page size of 200 rows.
- Search across all columns.
- Ascending and descending column sorting.
- Sticky-header, horizontally scrollable data grid.
- Null-value indicators and current-page CSV export.
- Direct navigation from Recent Uploads to Dataset Explorer.
- Backend service tests for search, sorting and pagination.

## API

`GET /api/uploads/{upload_id}/preview`

Query parameters:

- `page`
- `page_size`
- `search`
- `sort_by`
- `sort_direction=asc|desc`

## Next

Feature Pack 3.5.0 will introduce configurable Data Quality rules and exceptions, using the Dataset Explorer as the drill-down surface for affected records.
