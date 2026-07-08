import { Alert, Card, CardContent, Stack, Typography } from '@mui/material';
import { ValidationFinding } from '../../types/dataPlatform';

export default function ValidationSummary({ findings }: { findings: ValidationFinding[] }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Validation Summary</Typography>
        <Stack spacing={1}>
          {findings.map((finding, index) => (
            <Alert key={`${finding.code}-${index}`} severity={finding.severity === 'ERROR' ? 'error' : finding.severity === 'WARNING' ? 'warning' : 'info'}>
              <Typography fontWeight={800}>{finding.code}</Typography>
              <Typography variant="body2">{finding.message}</Typography>
            </Alert>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
