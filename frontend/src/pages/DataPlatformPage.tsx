import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
  Button,
  LinearProgress,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CableIcon from "@mui/icons-material/Cable";
import StorageIcon from "@mui/icons-material/Storage";
import CloudIcon from "@mui/icons-material/Cloud";

const connectors = [
  { name: "CSV Upload", status: "Enabled", icon: <UploadFileIcon /> },
  { name: "FIX Feed", status: "Coming Soon", icon: <CableIcon /> },
  { name: "Kafka", status: "Coming Soon", icon: <CableIcon /> },
  { name: "REST API", status: "Coming Soon", icon: <CloudIcon /> },
  { name: "S3 / Blob", status: "Coming Soon", icon: <StorageIcon /> },
  { name: "Database", status: "Coming Soon", icon: <StorageIcon /> },
];

const uploads = [
  ["orders_sample.csv", "Orders", "12,450", "Completed", "98%"],
  ["trades_sample.csv", "Trades", "4,812", "Completed", "97%"],
  ["market_data.csv", "Market Data", "32,901", "Processing", "64%"],
];

export default function DataPlatformPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={800}>
        Data Platform
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Connect, validate and catalogue trading data for surveillance.
      </Typography>

      <Grid container spacing={2}>
        {connectors.map((c) => (
          <Grid item xs={12} sm={6} md={4} key={c.name}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  {c.icon}
                  <Box flex={1}>
                    <Typography fontWeight={700}>{c.name}</Typography>
                    <Chip
                      size="small"
                      label={c.status}
                      color={c.status === "Enabled" ? "primary" : "default"}
                    />
                  </Box>
                </Stack>
                <Button sx={{ mt: 2 }} variant={c.status === "Enabled" ? "contained" : "outlined"} fullWidth>
                  {c.status === "Enabled" ? "Upload File" : "Coming Soon"}
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
        {uploads.map(([file, dataset, rows, status, quality]) => (
          <Grid item xs={12} key={file}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography fontWeight={700}>{file}</Typography>
                    <Typography color="text.secondary">
                      {dataset} · {rows} rows
                    </Typography>
                  </Box>
                  <Chip label={status} color={status === "Completed" ? "success" : "warning"} />
                </Stack>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption">Validation quality: {quality}</Typography>
                  <LinearProgress variant="determinate" value={parseInt(quality)} sx={{ mt: 1 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
