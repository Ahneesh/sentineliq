import { Card, CardContent, LinearProgress, Stack, Typography } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import { DatasetAsset } from '../../types/dataPlatform';

const qualityByType: Record<string, number> = {
  ORDERS: 98,
  TRADES: 99,
  MARKET_DATA: 94,
  REFERENCE_DATA: 97,
};

export default function DatasetCard({ dataset }: { dataset: DatasetAsset }) {
  const quality = qualityByType[String(dataset.dataset_type)] ?? 95;
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <StorageIcon color="primary" />
            <Typography fontWeight={900}>{dataset.name}</Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary">{dataset.dataset_type}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ minHeight: 44 }}>{dataset.description}</Typography>
          <Stack spacing={0.5}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" fontWeight={800}>Data quality</Typography>
              <Typography variant="caption" fontWeight={900}>{quality}%</Typography>
            </Stack>
            <LinearProgress variant="determinate" value={quality} sx={{ height: 8, borderRadius: 99 }} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
