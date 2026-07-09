import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CableIcon from "@mui/icons-material/Cable";
import StorageIcon from "@mui/icons-material/Storage";
import CloudIcon from "@mui/icons-material/Cloud";
import { getDatasetProfile, listUploads, uploadCsv } from "../services/dataPlatformApi";
import type { DatasetProfile, UploadRecord } from "../types/dataPlatform";

const connectors = [
  { name: "CSV Upload", status: "Enabled", icon: <UploadFileIcon /> },
  { name: "FIX Feed", status: "Coming Soon", icon: <CableIcon /> },
  { name: "Kafka", status: "Coming Soon", icon: <CableIcon /> },
  { name: "REST API", status: "Coming Soon", icon: <CloudIcon /> },
  { name: "S3 / Blob", status: "Coming Soon", icon: <StorageIcon /> },
  { name: "Database", status: "Coming Soon", icon: <StorageIcon /> },
];

export default function DataPlatformPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploads, setUploads] = useState<UploadRecord[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<DatasetProfile | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function refreshUploads() {
    const data = await listUploads();
    setUploads(data);
  }

  useEffect(() => {
    refreshUploads().catch(() => setError("Unable to load uploads from API."));
  }, []);

  async function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setError(null);
    setSuccess(null);
    try {
      const upload = await uploadCsv(file);
      setSuccess(`${upload.file_name} uploaded, validated and profiled successfully.`);
      await refreshUploads();
      const profile = await getDatasetProfile(upload.id);
      setSelectedProfile(profile);
    } catch (err) {
      setError("Upload failed. Check that the backend is running and the file is a valid CSV.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  async function openProfile(uploadId: number) {
    const profile = await getDatasetProfile(uploadId);
    setSelectedProfile(profile);
  }

  return (
    <Box sx={{ p: 4, maxWidth: 1340, mx: "auto" }}>
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems="center" spacing={2}>
        <Box textAlign={{ xs: "center", md: "left" }}>
          <Typography variant="h3" fontWeight={800}>Data Platform</Typography>
          <Typography color="text.secondary" variant="h6">
            Connect, validate, profile and catalogue trading data for surveillance.
          </Typography>
        </Box>
        <Card sx={{ minWidth: 260 }}>
          <CardContent sx={{ textAlign: "center" }}>
            <Typography>Completed Uploads</Typography>
            <Typography variant="h3">{uploads.filter((u) => u.status === "COMPLETED").length}</Typography>
          </CardContent>
        </Card>
      </Stack>

      {success && <Alert severity="success" sx={{ mt: 3 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
      {isUploading && <LinearProgress sx={{ mt: 3 }} />}

      <input ref={inputRef} type="file" accept=".csv" hidden onChange={handleFileSelected} />

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {connectors.map((c) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={c.name}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  {c.icon}
                  <Box flex={1}>
                    <Typography fontWeight={700}>{c.name}</Typography>
                    <Chip size="small" label={c.status} color={c.status === "Enabled" ? "primary" : "default"} />
                  </Box>
                </Stack>
                <Button
                  sx={{ mt: 2 }}
                  variant={c.status === "Enabled" ? "contained" : "outlined"}
                  disabled={c.status !== "Enabled" || isUploading}
                  fullWidth
                  onClick={() => inputRef.current?.click()}
                >
                  {c.status === "Enabled" ? "Upload File" : "Coming Soon"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" fontWeight={800} sx={{ mt: 5, mb: 2 }}>Recent Uploads</Typography>
      <Grid container spacing={2}>
        {uploads.map((u) => (
          <Grid item xs={12} md={6} key={u.id}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography fontWeight={700}>{u.file_name}</Typography>
                    <Typography color="text.secondary">
                      {u.dataset_type} · {u.row_count.toLocaleString()} rows · {u.uploaded_by}
                    </Typography>
                  </Box>
                  <Chip label={u.status} color="success" />
                </Stack>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption">Validation quality: {u.validation_score}%</Typography>
                  <LinearProgress variant="determinate" value={u.validation_score} sx={{ mt: 1 }} />
                </Box>
                <Button sx={{ mt: 2 }} onClick={() => openProfile(u.id)}>View Profile</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedProfile && (
        <Card sx={{ mt: 5 }}>
          <CardContent>
            <Typography variant="h5" fontWeight={800}>Dataset Profile: {selectedProfile.file_name}</Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6} md={2}><Metric label="Rows" value={selectedProfile.row_count.toLocaleString()} /></Grid>
              <Grid item xs={6} md={2}><Metric label="Columns" value={selectedProfile.column_count.toString()} /></Grid>
              <Grid item xs={6} md={2}><Metric label="Duplicates" value={selectedProfile.duplicate_rows.toString()} /></Grid>
              <Grid item xs={6} md={2}><Metric label="Null %" value={`${selectedProfile.null_percentage}%`} /></Grid>
              <Grid item xs={6} md={2}><Metric label="Quality" value={`${selectedProfile.quality_score}%`} /></Grid>
              <Grid item xs={6} md={2}><Metric label="Size" value={`${Math.round(Number(selectedProfile.statistics.file_size_bytes || 0) / 1024)} KB`} /></Grid>
            </Grid>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>Column Explorer</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Column</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Nulls</TableCell>
                  <TableCell align="right">Distinct</TableCell>
                  <TableCell align="right">Completeness</TableCell>
                  <TableCell>Stats / Samples</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedProfile.schema.map((col) => (
                  <TableRow key={col.name}>
                    <TableCell>{col.name}</TableCell>
                    <TableCell>{col.inferred_type}</TableCell>
                    <TableCell align="right">{col.null_percentage}%</TableCell>
                    <TableCell align="right">{col.distinct_count}</TableCell>
                    <TableCell align="right">{col.completeness}%</TableCell>
                    <TableCell>{JSON.stringify(col.statistics)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Card variant="outlined">
      <CardContent sx={{ textAlign: "center" }}>
        <Typography color="text.secondary" variant="caption">{label}</Typography>
        <Typography variant="h5" fontWeight={800}>{value}</Typography>
      </CardContent>
    </Card>
  );
}
