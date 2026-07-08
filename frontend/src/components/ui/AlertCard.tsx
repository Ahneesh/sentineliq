import { Card, CardContent, Stack, Typography, Box } from '@mui/material';
import RiskBadge from './RiskBadge';
import type { Alert } from '../../types/surveillance';

export default function AlertCard({ alert }: { alert: Alert }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6">{alert.type}</Typography>
              <RiskBadge level={alert.level} />
            </Stack>
            <Typography variant="body2" color="text.secondary">{alert.id} · {alert.trader} · {alert.desk} · {alert.instrument}</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>{alert.aiSummary}</Typography>
          </Box>
          <Box textAlign="right">
            <Typography variant="h5" color="error.main">{alert.risk}</Typography>
            <Typography variant="caption" color="text.secondary">{alert.confidence}% confidence</Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
