import { createTheme } from '@mui/material/styles';

export const auroraTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2563EB' },
    secondary: { main: '#7C3AED' },
    background: { default: '#F8FAFC', paper: '#FFFFFF' },
    text: { primary: '#0F172A', secondary: '#64748B' },
    error: { main: '#DC2626' },
    warning: { main: '#F59E0B' },
    success: { main: '#16A34A' },
  },
  typography: {
    fontFamily: ['Inter', 'ui-sans-serif', 'system-ui', 'Arial'].join(','),
    h4: { fontWeight: 800 },
    h5: { fontWeight: 750 },
    h6: { fontWeight: 700 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: { styleOverrides: { root: { boxShadow: '0 1px 2px rgba(15,23,42,0.08)', border: '1px solid #E2E8F0' } } },
    MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 700 } } },
  },
});
