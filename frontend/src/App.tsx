import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { auroraTheme } from "./theme/auroraTheme";
import MainLayout from "./components/layout/MainLayout";
import DataPlatformPage from "./pages/DataPlatformPage";
import DataExplorerPage from "./pages/DataExplorerPage";
import DashboardPage from "./pages/DashboardPage";
import AlertsPage from "./pages/AlertsPage";
import InvestigationPage from "./pages/InvestigationPage";
import CasesPage from "./pages/CasesPage";
import AIAssistantPage from "./pages/AIAssistantPage";
import ScenarioCataloguePage from "./pages/ScenarioCataloguePage";
import ScenarioDetailPage from "./pages/ScenarioDetailPage";

function App() {
  return (
    <ThemeProvider theme={auroraTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/data" element={<DataPlatformPage />} />
            <Route path="/data/:uploadId/explore" element={<DataExplorerPage />} />
            <Route path="/surveillance/scenarios" element={<ScenarioCataloguePage />} />
            <Route path="/surveillance/scenarios/:scenarioId" element={<ScenarioDetailPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/investigations" element={<InvestigationPage />} />
            <Route path="/cases" element={<CasesPage />} />
            <Route path="/ai" element={<AIAssistantPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
