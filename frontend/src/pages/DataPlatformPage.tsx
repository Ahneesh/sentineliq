import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CableIcon from "@mui/icons-material/Cable";
import StorageIcon from "@mui/icons-material/Storage";
import CloudIcon from "@mui/icons-material/Cloud";

import { fetchUploads, uploadCsv } from "../services/uploadService";
import type { UploadRecord } from "../types/dataPlatform";

const connectors = [
  { name: "CSV Upload", status: "Enabled", icon: <UploadFileIcon /> },
  { name: "FIX Feed", status: "Coming Soon", icon: <CableIcon /> },
  { name: "Kafka", status: "Coming Soon", icon: <CableIcon /> },
  { name: "REST API", status: "Coming Soon", icon: <CloudIcon /> },
  { name: "S3 / Blob", status: "Coming Soon", icon: <StorageIcon /> },
  { name: "Database", status: "Coming Soon", icon: <StorageIcon /> },
];

const fallbackUploads: UploadRecord[] = [
  {
    id: 1,
    file_name: "orders_sample.csv",
    dataset_type: "Orders",
    row_count: 12450,
    status: "COMPLETED",
    validation_score: 98,
    uploaded_by: "Sarah Johnson",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    file_name: "trades_sample.csv",
    dataset_type: "Trades",
    row_count: 4812,
    status: "COMPLETED",
    validation_score: 97,
    uploaded_by: "Sarah Johnson",
    created_at: new Date().toISOString(),
  },
];

function formatRows(rows: number): string {
  return new Intl.NumberFormat("en-GB").format(rows);
}

export default function DataPlatformPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploads, setUploads] = useState<UploadRecord[]>(fallbackUploads);
  const [isUploading, setIsUploading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const completedUploads = useMemo(
    () => uploads.filter((upload) => upload.status === "COMPLETED").length,
    [uploads]
  );

  async function loadUploads() {
    try {
      const apiUploads = await fetchUploads();
      if (apiUploads.length > 0) {
        setUploads(apiUploads);
      }
    } catch {
      // Keep mock data visible when backend is not running.
    }
  }

  useEffect(() => {
    loadUploads();
  }, []);

  async function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setNotice(null);

    try {
      const uploaded = await uploadCsv(file);
      setUploads((current) => [uploaded, ...current.filter((item) => item.id !== uploaded.id)]);
      setNotice(`${file.name} uploaded and validated successfully.`);
    } catch (err) {
      console.error(err);
      setError("Upload failed. Check that the backend is running on localhost:8000.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  return (
    <Box sx={{ p: 4 }}>
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" gap={2}>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Data Platform
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Connect, validate and catalogue trading data for surveillance.
          </Typography>
        </Box>

        <Card sx={{ minWidth: 280 }}>
          <CardContent>
            <Typography color="text.secondary" variant="body2">
              Completed Uploads
            </Typography>
            <Typography variant="h4" fontWeight={800}>
              {completedUploads}
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      {notice && <Alert severity="success" sx={{ mb: 2 }}>{notice}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {isUploading && <LinearProgress sx={{ mb: 2 }} />}

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        hidden
        onChange={handleFileSelected}
      />

      <Grid container spacing={2}>
        {connectors.map((connector) => (
          <Grid item xs={12} sm={6} md={4} key={connector.name}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  {connector.icon}
                  <Box flex={1}>
                    <Typography fontWeight={700}>{connector.name}</Typography>
                    <Chip
                      size="small"
                      label={connector.status}
                      color={connector.status === "Enabled" ? "primary" : "default"}
                    />
                  </Box>
                </Stack>
                <Button
                  sx={{ mt: 2 }}
                  variant={connector.status === "Enabled" ? "contained" : "outlined"}
                  fullWidth
                  disabled={connector.status !== "Enabled" || isUploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {connector.status === "Enabled" ? "Upload File" : "Coming Soon"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" fontWeight={700} sx={{ mt: 5, mb: 2 }}>
        Recent Uploads
      </Typography>

      <Grid container spacing={2}>
        {uploads.map((upload) => (
          <Grid item xs={12} md={6} key={upload.id}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography fontWeight={700}>{upload.file_name}</Typography>
                    <Typography color="text.secondary">
                      {upload.dataset_type} · {formatRows(upload.row_count)} rows · {upload.uploaded_by}
                    </Typography>
                  </Box>
                  <Chip
                    label={upload.status}
                    color={upload.status === "COMPLETED" ? "success" : "warning"}
                  />
                </Stack>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption">
                    Validation quality: {upload.validation_score}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={upload.validation_score}
                    sx={{ mt: 1 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
