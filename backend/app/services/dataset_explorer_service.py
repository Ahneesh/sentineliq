from __future__ import annotations

import csv
from pathlib import Path
from typing import Any

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.upload import Upload

MAX_PAGE_SIZE = 200


def _coerce_sort_value(value: str) -> tuple[int, Any]:
    if value is None or value == "":
        return (3, "")
    try:
        return (0, float(value))
    except (TypeError, ValueError):
        pass
    return (1, value.casefold())


def get_dataset_preview(
    db: Session,
    upload_id: int,
    *,
    page: int = 1,
    page_size: int = 25,
    search: str | None = None,
    sort_by: str | None = None,
    sort_direction: str = "asc",
) -> dict[str, Any]:
    upload = db.query(Upload).filter(Upload.id == upload_id).first()
    if upload is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Upload not found")
    if not upload.storage_path:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Uploaded file is unavailable")

    file_path = Path(upload.storage_path)
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Uploaded file is unavailable")

    page = max(page, 1)
    page_size = max(1, min(page_size, MAX_PAGE_SIZE))
    normalized_search = (search or "").strip().casefold()

    try:
        with file_path.open("r", encoding="utf-8-sig", newline="") as handle:
            reader = csv.DictReader(handle)
            columns = reader.fieldnames or []
            rows = [dict(row) for row in reader]
    except UnicodeDecodeError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Dataset preview currently supports UTF-8 CSV files only",
        ) from exc
    except csv.Error as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Unable to parse CSV: {exc}",
        ) from exc

    if normalized_search:
        rows = [
            row
            for row in rows
            if any(normalized_search in str(value or "").casefold() for value in row.values())
        ]

    if sort_by:
        if sort_by not in columns:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Unknown sort column: {sort_by}",
            )
        reverse = sort_direction.lower() == "desc"
        rows.sort(key=lambda row: _coerce_sort_value(row.get(sort_by, "")), reverse=reverse)

    total_rows = len(rows)
    start = (page - 1) * page_size
    end = start + page_size

    return {
        "upload": {
            "id": upload.id,
            "file_name": upload.file_name,
            "dataset_type": upload.dataset_type,
            "row_count": upload.row_count,
            "validation_score": upload.validation_score,
            "created_at": upload.created_at,
        },
        "columns": columns,
        "rows": rows[start:end],
        "page": page,
        "page_size": page_size,
        "total_rows": total_rows,
        "total_pages": max(1, (total_rows + page_size - 1) // page_size),
        "search": search or "",
        "sort_by": sort_by,
        "sort_direction": sort_direction.lower(),
    }
