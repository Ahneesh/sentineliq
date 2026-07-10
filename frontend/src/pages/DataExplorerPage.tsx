import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate, useParams } from "react-router-dom";

import { getDatasetPreview } from "../services/dataPlatformApi";
import type { DatasetPreviewResponse } from "../types/dataPlatform";

export default function DataExplorerPage() {
  const { uploadId } = useParams();
  const navigate = useNavigate();
  const numericUploadId = Number(uploadId);
  const [preview, setPreview] = useState<DatasetPreviewResponse | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isInteger(numericUploadId) || numericUploadId <= 0) {
      setError("The dataset identifier is invalid.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    getDatasetPreview(numericUploadId, { page, pageSize, search, sortBy, sortDirection })
      .then(setPreview)
      .catch(() => setError("Unable to load the dataset preview from the SentinelIQ API."))
      .finally(() => setIsLoading(false));
  }, [numericUploadId, page, pageSize, search, sortBy, sortDirection]);

  const downloadUrl = useMemo(() => {
    if (!preview) return null;
    const csv = [
      preview.columns.join(","),
      ...preview.rows.map((row) =>
        preview.columns
          .map((column) => `"${String(row[column] ?? "").replaceAll('"', '""')}"`)
          .join(","),
      ),
    ].join("\n");
    return URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  }, [preview]);

  function applySearch() {
    setPage(1);
    setSearch(searchInput.trim());
  }

  function toggleSort(column: string) {
    setPage(1);
    if (sortBy === column) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  }

  return (
    <Box sx={{ p: 4, maxWidth: 1600, mx: "auto" }}>
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" gap={2}>
        <Box>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/data")} sx={{ mb: 1 }}>
            Back to Data Platform
          </Button>
          <Typography variant="h3" fontWeight={800}>Dataset Explorer</Typography>
          <Typography color="text.secondary" variant="h6">
            Inspect uploaded order, execution, trade and market-data records before surveillance processing.
          </Typography>
        </Box>
        {preview && (
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip label={preview.upload.dataset_type} color="primary" />
            <Chip label={`${preview.upload.validation_score}% quality`} color="success" variant="outlined" />
          </Stack>
        )}
      </Stack>

      {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
      {isLoading && <Stack alignItems="center" sx={{ py: 8 }}><CircularProgress /></Stack>}

      {preview && !isLoading && (
        <>
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Stack direction={{ xs: "column", lg: "row" }} justifyContent="space-between" gap={2}>
                <Box>
                  <Typography variant="h5" fontWeight={800}>{preview.upload.file_name}</Typography>
                  <Typography color="text.secondary">
                    {preview.total_rows.toLocaleString()} matching rows · {preview.columns.length} columns · page {preview.page} of {preview.total_pages}
                  </Typography>
                </Box>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                  <TextField
                    size="small"
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    onKeyDown={(event) => event.key === "Enter" && applySearch()}
                    placeholder="Search all columns"
                    sx={{ minWidth: 280 }}
                  />
                  <Button variant="contained" startIcon={<SearchIcon />} onClick={applySearch}>Search</Button>
                  {downloadUrl && (
                    <Button component="a" href={downloadUrl} download={`preview-${preview.upload.file_name}`} startIcon={<DownloadIcon />}>
                      Export page
                    </Button>
                  )}
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <TableContainer sx={{ maxHeight: "62vh" }}>
              <Table stickyHeader size="small" sx={{ minWidth: Math.max(900, preview.columns.length * 150) }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800, bgcolor: "background.paper" }}>#</TableCell>
                    {preview.columns.map((column) => (
                      <TableCell
                        key={column}
                        onClick={() => toggleSort(column)}
                        sx={{ fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap", bgcolor: "background.paper" }}
                      >
                        {column}{sortBy === column ? (sortDirection === "asc" ? " ↑" : " ↓") : ""}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {preview.rows.map((row, index) => (
                    <TableRow hover key={`${preview.page}-${index}`}>
                      <TableCell color="text.secondary">{(preview.page - 1) * preview.page_size + index + 1}</TableCell>
                      {preview.columns.map((column) => (
                        <TableCell key={column} sx={{ whiteSpace: "nowrap", maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis" }}>
                          {row[column] === null || row[column] === "" ? <Chip label="NULL" size="small" variant="outlined" /> : row[column]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  {preview.rows.length === 0 && (
                    <TableRow><TableCell colSpan={preview.columns.length + 1} align="center" sx={{ py: 6 }}>No matching rows</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" spacing={2} sx={{ mt: 2 }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Rows per page</InputLabel>
              <Select
                label="Rows per page"
                value={pageSize}
                onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }}
              >
                {[10, 25, 50, 100, 200].map((size) => <MenuItem value={size} key={size}>{size}</MenuItem>)}
              </Select>
            </FormControl>
            <Pagination count={preview.total_pages} page={preview.page} onChange={(_event, value) => setPage(value)} color="primary" />
          </Stack>
        </>
      )}
    </Box>
  );
}
