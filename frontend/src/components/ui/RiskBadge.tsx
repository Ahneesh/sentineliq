import { Chip } from '@mui/material';
import type { RiskLevel } from '../../types/surveillance';

const colorMap: Record<RiskLevel, { bg: string; fg: string }> = {
  CRITICAL: { bg: '#FEE2E2', fg: '#991B1B' },
  HIGH: { bg: '#FFEDD5', fg: '#9A3412' },
  MEDIUM: { bg: '#FEF3C7', fg: '#92400E' },
  LOW: { bg: '#DBEAFE', fg: '#1E40AF' },
};

export default function RiskBadge({ level }: { level: RiskLevel }) {
  const c = colorMap[level];
  return <Chip size="small" label={level} sx={{ bgcolor: c.bg, color: c.fg, fontWeight: 800, letterSpacing: 0.3 }} />;
}
