import { Chip } from '@mui/material';

const config: Record<string, { label: string; color: 'success' | 'warning' | 'error' | 'info' | 'default' }> = {
  COMPLETED: { label: 'Completed', color: 'success' },
  FAILED: { label: 'Failed', color: 'error' },
  VALIDATING: { label: 'Validating', color: 'warning' },
  RECEIVED: { label: 'Received', color: 'info' },
  AVAILABLE: { label: 'Available', color: 'success' },
  COMING_SOON: { label: 'Coming soon', color: 'default' },
};

export default function StatusBadge({ status }: { status: string }) {
  const value = config[status] ?? { label: status, color: 'default' as const };
  return <Chip label={value.label} color={value.color} size="small" sx={{ fontWeight: 800 }} />;
}
