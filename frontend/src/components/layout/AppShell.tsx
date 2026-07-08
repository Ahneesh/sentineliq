import { Box, Divider, List, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import WorkIcon from '@mui/icons-material/Work';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { NavLink, Outlet } from 'react-router-dom';

const items = [
  ['/', 'Dashboard', <DashboardIcon />],
  ['/alerts', 'Alerts', <WarningAmberIcon />],
  ['/investigation', 'Investigation', <ManageSearchIcon />],
  ['/cases', 'Cases', <WorkIcon />],
  ['/data', 'Data Platform', <CloudUploadIcon />],
  ['/ai', 'AI Assistant', <AutoAwesomeIcon />],
  ['/analytics', 'Analytics', <AssessmentIcon />],
  ['/settings', 'Settings', <SettingsIcon />],
] as const;

export default function AppShell() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box sx={{ width: 260, bgcolor: '#0F172A', color: 'white', p: 2 }}>
        <Typography variant="h5" fontWeight={900}>SentinelIQ</Typography>
        <Typography variant="caption" sx={{ color: '#94A3B8' }}>Market Surveillance OS</Typography>
        <Divider sx={{ my: 2, borderColor: '#1E293B' }} />
        <List>
          {items.map(([to, label, icon]) => (
            <ListItemButton key={to} component={NavLink} to={to} sx={{ borderRadius: 2, mb: .5, color: '#CBD5E1', '&.active': { bgcolor: '#1E293B', color: 'white' } }}>
              <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>{icon}</ListItemIcon>
              <ListItemText primary={label} primaryTypographyProps={{ fontSize: 14, fontWeight: 700 }} />
            </ListItemButton>
          ))}
        </List>
        <Divider sx={{ my: 2, borderColor: '#1E293B' }} />
        <Typography variant="caption" sx={{ color: '#64748B' }}>Data Platform · Pack 3.1.1</Typography>
      </Box>
      <Box sx={{ flex: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ height: 64, px: 3, bgcolor: 'white', borderBottom: '1px solid #E2E8F0' }}>
          <Typography fontWeight={800}>Aurora Prototype</Typography>
          <Typography variant="body2" color="text.secondary">Development · v0.3.1</Typography>
        </Stack>
        <Box sx={{ p: 3 }}><Outlet /></Box>
      </Box>
    </Box>
  );
}
