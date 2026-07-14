import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import { Link, useParams } from "react-router-dom";
import {
  getScenario,
  updateScenarioStatus,
} from "../services/scenarioApi";
import type { ScenarioDetail } from "../types/scenario";

export default function ScenarioDetailPage() {
  const { scenarioId } = useParams();
  const [scenario, setScenario] = useState<ScenarioDetail | null>(null);
  const [tab, setTab] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!scenarioId) {
      return;
    }

    getScenario(Number(scenarioId))
      .then(setScenario)
      .catch(() => setError("Unable to load scenario details."));
  }, [scenarioId]);

  async function promote() {
    if (!scenario) {
      return;
    }

    const nextStatus =
      scenario.status === "DRAFT"
        ? "IN_REVIEW"
        : scenario.status === "IN_REVIEW"
          ? "APPROVED"
          : "PRODUCTION";

    try {
      setScenario(
        await updateScenarioStatus(
          scenario.id,
          nextStatus,
          "Lifecycle update from Scenario Administration UI.",
        ),
      );
    } catch {
      setError("Unable to update scenario status.");
    }
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!scenario) {
    return (
      <Box sx={{ p: 8, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1500, mx: "auto" }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link to="/surveillance/scenarios">Scenario Catalogue</Link>
        <Typography>{scenario.name}</Typography>
      </Breadcrumbs>

      <Stack
        direction={{ xs: "column", md: "row" }}
        sx={{
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
        }}
      >
        <Box>
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: "center", flexWrap: "wrap" }}
          >
            <Typography variant="h3" sx={{ fontWeight: 900 }}>
              {scenario.name}
            </Typography>
            <Chip
              label={scenario.status.replace("_", " ")}
              color={
                scenario.status === "PRODUCTION" ? "success" : "warning"
              }
            />
          </Stack>
          <Typography color="text.secondary">
            {scenario.code} · Version {scenario.version} · {scenario.category}
          </Typography>
        </Box>

        {scenario.status !== "PRODUCTION" &&
          scenario.status !== "RETIRED" && (
            <Button variant="contained" onClick={promote}>
              Move to next stage
            </Button>
          )}
      </Stack>

      <Card sx={{ mt: 3 }}>
        <Tabs
          value={tab}
          onChange={(_, value: number) => setTab(value)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {[
            "Overview",
            "Logic",
            "Thresholds",
            "Data",
            "Applicability",
            "AI Knowledge",
            "Audit",
          ].map((label) => (
            <Tab key={label} label={label} />
          ))}
        </Tabs>

        <Divider />

        <CardContent sx={{ p: 3 }}>
          {tab === 0 && <Overview scenario={scenario} />}
          {tab === 1 && <Logic scenario={scenario} />}
          {tab === 2 && <Thresholds scenario={scenario} />}
          {tab === 3 && <DataRequirements scenario={scenario} />}
          {tab === 4 && <Applicability scenario={scenario} />}
          {tab === 5 && <AiKnowledge scenario={scenario} />}
          {tab === 6 && <Audit scenario={scenario} />}
        </CardContent>
      </Card>
    </Box>
  );
}

function Overview({ scenario }: { scenario: ScenarioDetail }) {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 8 }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Description
        </Typography>
        <Typography sx={{ mt: 1 }}>{scenario.description}</Typography>

        <Typography variant="h6" sx={{ mt: 3, fontWeight: 800 }}>
          Business Purpose
        </Typography>
        <Typography sx={{ mt: 1 }}>{scenario.business_purpose}</Typography>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Info label="Risk" value={scenario.risk_level} />
        <Info label="Owner" value={scenario.owner} />
        <Info label="Version" value={scenario.version} />

        <Typography sx={{ mt: 2, fontWeight: 800 }}>
          Regulatory basis
        </Typography>
        <Stack
          direction="row"
          useFlexGap
          sx={{ mt: 1, flexWrap: "wrap", gap: 1 }}
        >
          {scenario.regulatory_basis.map((item) => (
            <Chip key={item} label={item} />
          ))}
        </Stack>
      </Grid>
    </Grid>
  );
}

function Logic({ scenario }: { scenario: ScenarioDetail }) {
  const conditions = scenario.detection_logic.all ?? [];

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 800 }}>
        Detection Logic
      </Typography>
      <Typography color="text.secondary">
        All configured conditions must currently be satisfied. The executable
        rule engine arrives in v0.5.0.
      </Typography>

      <Stack spacing={1.5} sx={{ mt: 3 }}>
        {conditions.map((condition, index) => (
          <Card variant="outlined" key={condition}>
            <CardContent>
              <Typography variant="overline">
                Condition {index + 1}
              </Typography>
              <Typography sx={{ fontWeight: 800 }}>
                {condition.replaceAll("_", " ").toUpperCase()}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}

function Thresholds({ scenario }: { scenario: ScenarioDetail }) {
  if (!scenario.parameters.length) {
    return <Typography>No parameters configured yet.</Typography>;
  }

  return (
    <Grid container spacing={2}>
      {scenario.parameters.map((parameter) => (
        <Grid size={{ xs: 12, md: 6 }} key={parameter.id}>
          <Card variant="outlined">
            <CardContent>
              <Stack
                direction="row"
                sx={{ justifyContent: "space-between", gap: 2 }}
              >
                <Typography sx={{ fontWeight: 850 }}>
                  {parameter.label}
                </Typography>
                <Chip
                  color="primary"
                  label={`${parameter.value}${parameter.unit ? ` ${parameter.unit}` : ""}`}
                />
              </Stack>

              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {parameter.description}
              </Typography>
              <Typography
                variant="caption"
                color="warning.main"
                sx={{ mt: 2, display: "block" }}
              >
                {parameter.sensitivity_note}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

function DataRequirements({ scenario }: { scenario: ScenarioDetail }) {
  if (!scenario.datasets.length) {
    return (
      <Typography>
        Dataset requirements will be configured in the next iteration.
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {scenario.datasets.map((dataset) => (
        <Card variant="outlined" key={dataset.id}>
          <CardContent>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", gap: 2 }}
            >
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <StatusCheck
                  tone={dataset.required ? "success" : "disabled"}
                />
                <Typography sx={{ fontWeight: 850 }}>
                  {dataset.dataset_type}
                </Typography>
              </Stack>

              <Chip
                label={dataset.required ? "Required" : "Optional"}
                color={dataset.required ? "primary" : "default"}
              />
            </Stack>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {dataset.rationale}
            </Typography>
            <Typography variant="caption">
              Minimum quality score: {dataset.minimum_quality_score}%
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}

function Applicability({ scenario }: { scenario: ScenarioDetail }) {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 4 }}>
        <TagGroup title="Asset Classes" values={scenario.asset_classes} />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TagGroup title="Regions" values={scenario.regions} />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TagGroup
          title="Venues"
          values={
            scenario.venues.length
              ? scenario.venues
              : ["All configured venues"]
          }
        />
      </Grid>
    </Grid>
  );
}

function AiKnowledge({ scenario }: { scenario: ScenarioDetail }) {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Alert icon={<PsychologyOutlinedIcon />} severity="info">
          <Typography sx={{ fontWeight: 850 }}>AI Explanation</Typography>
          {scenario.ai_explanation}
        </Alert>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Known False Positives
        </Typography>
        <List>
          {scenario.known_false_positives.map((item) => (
            <ListItem key={item}>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Investigation Guidance
        </Typography>
        <List>
          {scenario.investigation_guidance.map((item) => (
            <ListItem key={item}>
              <ListItemIcon>
                <StatusCheck tone="primary" />
              </ListItemIcon>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  );
}

function Audit({ scenario }: { scenario: ScenarioDetail }) {
  if (!scenario.audits.length) {
    return <Typography>No audit events recorded.</Typography>;
  }

  return (
    <Stack spacing={2}>
      {scenario.audits.map((audit) => (
        <Card variant="outlined" key={audit.id}>
          <CardContent>
            <Stack direction="row" spacing={2}>
              <HistoryIcon color="action" />
              <Box>
                <Typography sx={{ fontWeight: 850 }}>
                  {audit.action.replaceAll("_", " ")}
                </Typography>
                <Typography>
                  {audit.field_name &&
                    `${audit.field_name}: ${audit.old_value ?? "—"} → ${audit.new_value ?? "—"}`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {audit.changed_by} · {new Date(audit.created_at).toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {audit.reason}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <Stack
      direction="row"
      sx={{
        py: 1,
        borderBottom: "1px solid",
        borderColor: "divider",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Typography color="text.secondary">{label}</Typography>
      <Typography sx={{ fontWeight: 800 }}>{value}</Typography>
    </Stack>
  );
}

function TagGroup({ title, values }: { title: string; values: string[] }) {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 800 }}>
        {title}
      </Typography>
      <Stack
        direction="row"
        useFlexGap
        sx={{ mt: 2, flexWrap: "wrap", gap: 1 }}
      >
        {values.map((value) => (
          <Chip
            key={value}
            label={value}
            color="primary"
            variant="outlined"
          />
        ))}
      </Stack>
    </Box>
  );
}

type StatusCheckTone = "primary" | "success" | "disabled";

function StatusCheck({ tone }: { tone: StatusCheckTone }) {
  const colourMap: Record<StatusCheckTone, string> = {
    primary: "#2563EB",
    success: "#16A34A",
    disabled: "#94A3B8",
  };

  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 20,
        height: 20,
        borderRadius: "50%",
        border: `2px solid ${colourMap[tone]}`,
        color: colourMap[tone],
        fontSize: 13,
        fontWeight: 900,
        lineHeight: 1,
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      ✓
    </Box>
  );
}
