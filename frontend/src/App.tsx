import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { auroraTheme } from "./theme/auroraTheme";
import DataPlatformPage from "./pages/DataPlatformPage";
import DataExplorerPage from "./pages/DataExplorerPage";
import DashboardPage from "./pages/DashboardPage";
import AlertsPage from "./pages/AlertsPage";
import InvestigationPage from "./pages/InvestigationPage";
import CasesPage from "./pages/CasesPage";
import AIAssistantPage from "./pages/AIAssistantPage";

function App() {
  return (
    <ThemeProvider theme={auroraTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/investigations" element={<InvestigationPage />} />
          <Route path="/cases" element={<CasesPage />} />
          <Route path="/data" element={<DataPlatformPage />} />
          <Route path="/data/:uploadId/explore" element={<DataExplorerPage />} />
          <Route path="/ai" element={<AIAssistantPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
