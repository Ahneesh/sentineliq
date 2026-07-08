import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { auroraTheme } from './theme/auroraTheme';
import AppShell from './components/layout/AppShell';
import DashboardPage from './pages/DashboardPage';
import AlertsPage from './pages/AlertsPage';
import InvestigationPage from './pages/InvestigationPage';
import CasesPage from './pages/CasesPage';
import AIAssistantPage from './pages/AIAssistantPage';

function Placeholder({ title }: { title: string }) { return <h1>{title}</h1>; }

export default function App() {
  return (
    <ThemeProvider theme={auroraTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/investigation" element={<InvestigationPage />} />
            <Route path="/cases" element={<CasesPage />} />
            <Route path="/ai" element={<AIAssistantPage />} />
            <Route path="/analytics" element={<Placeholder title="Analytics" />} />
            <Route path="/settings" element={<Placeholder title="Settings" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
