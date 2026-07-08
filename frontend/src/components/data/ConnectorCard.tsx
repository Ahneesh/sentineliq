import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import HubIcon from '@mui/icons-material/Hub';
import ApiIcon from '@mui/icons-material/Api';
import StorageIcon from '@mui/icons-material/Storage';
import DatasetIcon from '@mui/icons-material/Dataset';
import StatusBadge from '../ui/StatusBadge';
import { DataConnector } from '../../types/dataPlatform';

function iconFor(id: string) {
  if (id === 'csv') return <UploadFileIcon />;
  if (id === 'fix' || id === 'kafka') return <HubIcon />;
  if (id === 'rest') return <ApiIcon />;
  if (id === 'database') return <DatasetIcon />;
  return <StorageIcon />;
}

export default function ConnectorCard({ connector, onSelect }: { connector: DataConnector; onSelect?: () => void }) {
  const isAvailable = connector.status === 'AVAILABLE';
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1.5} alignItems="center">
              {iconFor(connector.id)}
              <Typography fontWeight={900}>{connector.name}</Typography>
            </Stack>
            <StatusBadge status={connector.status} />
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ minHeight: 42 }}>{connector.description}</Typography>
          <Button variant={isAvailable ? 'contained' : 'outlined'} disabled={!isAvailable} onClick={onSelect}>
            {isAvailable ? 'Upload Data' : 'Coming Soon'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
