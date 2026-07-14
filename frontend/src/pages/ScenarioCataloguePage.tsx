import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import {
  getScenarioMetrics,
  listScenarios,
} from "../services/scenarioApi";
import type {
  ScenarioMetrics,
  ScenarioSummary,
} from "../types/scenario";

const riskColor: Record<string, "default" | "warning" | "error"> = {
  LOW: "default",
  MEDIUM: "warning",
  HIGH: "error",
  CRITICAL: "error",
};

const statusColor: Record<
  string,
  "default" | "info" | "success" | "warning"
> = {
  DRAFT: "default",
  IN_REVIEW: "warning",
  APPROVED: "info",
  PRODUCTION: "success",
  RETIRED: "default",
};

export default function ScenarioCataloguePage() {
  const [scenarios, setScenarios] = useState<ScenarioSummary[]>([]);
  const [metrics, setMetrics] = useState<ScenarioMetrics | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([listScenarios(), getScenarioMetrics()])
      .then(([scenarioData, metricData]) => {
        setScenarios(scenarioData);
        setMetrics(metricData);
      })
      .catch(() => setError("Unable to load the scenario catalogue."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () =>
      scenarios.filter((scenario) => {
        const matchesSearch = `${scenario.name} ${scenario.code} ${scenario.description}`
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesStatus = !status || scenario.status === status;
        return matchesSearch && matchesStatus;
      }),
    [scenarios, search, status],
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1500, mx: "auto" }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        sx={{ justifyContent: "space-between", gap: 2 }}
      >
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 900 }}>
            Scenario Administration
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Configure, govern and explain SentinelIQ surveillance scenarios.
          </Typography>
        </Box>

        <Button variant="contained" startIcon={<AddIcon />} disabled>
          Create Scenario
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Metric label="Total Scenarios" value={metrics?.total ?? 0} />
        <Metric label="Production" value={metrics?.production ?? 0} />
        <Metric
          label="Awaiting Review"
          value={(metrics?.in_review ?? 0) + (metrics?.approved ?? 0)}
        />
        <Metric label="Draft" value={metrics?.draft ?? 0} />
      </Grid>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              fullWidth
              placeholder="Search scenarios, codes or descriptions"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              select
              label="Status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">All statuses</MenuItem>
              {["DRAFT", "IN_REVIEW", "APPROVED", "PRODUCTION", "RETIRED"].map(
                (item) => (
                  <MenuItem key={item} value={item}>
                    {item.replace("_", " ")}
                  </MenuItem>
                ),
              )}
            </TextField>
          </Stack>
        </CardContent>
      </Card>

      {loading ? (
        <Box sx={{ py: 8, textAlign: "center" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {filtered.map((scenario) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={scenario.id}>
              <Card
                sx={{
                  height: "100%",
                  borderTop: "4px solid",
                  borderColor:
                    scenario.risk_level === "HIGH"
                      ? "error.main"
                      : "warning.main",
                }}
              >
                <CardContent>
                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 1,
                    }}
                  >
                    <Box>
                      <Typography variant="overline" color="text.secondary">
                        {scenario.code} · v{scenario.version}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 850 }}>
                        {scenario.name}
                      </Typography>
                    </Box>

                    <Chip
                      size="small"
                      label={scenario.risk_level}
                      color={riskColor[scenario.risk_level] ?? "default"}
                    />
                  </Stack>

                  <Typography
                    color="text.secondary"
                    sx={{ mt: 1, minHeight: 72 }}
                  >
                    {scenario.description}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={1}
                    useFlexGap
                    sx={{ mt: 2, flexWrap: "wrap" }}
                  >
                    <Chip
                      size="small"
                      label={scenario.status.replace("_", " ")}
                      color={statusColor[scenario.status] ?? "default"}
                    />
                    {scenario.asset_classes.slice(0, 2).map((asset) => (
                      <Chip
                        key={asset}
                        size="small"
                        variant="outlined"
                        label={asset}
                      />
                    ))}
                  </Stack>

                  <Stack
                    direction="row"
                    sx={{
                      mt: 3,
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Owner: {scenario.owner}
                    </Typography>
                    <Button
                      component={Link}
                      to={`/surveillance/scenarios/${scenario.id}`}
                      endIcon={<ArrowForwardIcon />}
                    >
                      Open
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <Grid size={{ xs: 6, md: 3 }}>
      <Card>
        <CardContent>
          <Typography color="text.secondary">{label}</Typography>
          <Typography variant="h3" sx={{ fontWeight: 900 }}>
            {value}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}
