import { Card, CardContent, Stack, Typography } from '@mui/material';
import type { Metric } from '../../types/surveillance';

export default function MetricCard({ metric }: { metric: Metric }) {
  const color = metric.tone === 'positive' ? 'success.main' : metric.tone === 'negative' ? 'error.main' : 'text.secondary';
  return (
    <Card>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="body2" color="text.secondary">{metric.label}</Typography>
          <Typography variant="h4">{metric.value}</Typography>
          <Typography variant="caption" sx={{ color, fontWeight: 700 }}>{metric.delta}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
