import {
  AppBar,
  Box,
  Button,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import { NavLink, Outlet } from "react-router-dom";

const links = [
  {
    to: "/dashboard",
    label: "Command Centre",
    icon: <DashboardOutlinedIcon fontSize="small" />,
  },
  {
    to: "/data",
    label: "Data Platform",
    icon: <StorageOutlinedIcon fontSize="small" />,
  },
  {
    to: "/surveillance/scenarios",
    label: "Surveillance",
    icon: <ShieldOutlinedIcon fontSize="small" />,
  },
];

export default function MainLayout() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "#0F172A",
          borderBottom: "1px solid #1E293B",
        }}
      >
        <Toolbar sx={{ gap: 3 }}>
          <Box sx={{ mr: 2 }}>
            <Typography sx={{ fontWeight: 900, lineHeight: 1.1 }}>
              SentinelIQ
            </Typography>
            <Typography variant="caption" sx={{ color: "#94A3B8" }}>
              Market Surveillance OS · v0.4.0
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
            {links.map((link) => (
              <Button
                key={link.to}
                component={NavLink}
                to={link.to}
                startIcon={link.icon}
                sx={{
                  color: "#CBD5E1",
                  borderRadius: 2,
                  "&.active": {
                    color: "white",
                    bgcolor: "#1E293B",
                  },
                }}
              >
                {link.label}
              </Button>
            ))}
          </Stack>

          <Typography variant="body2" sx={{ color: "#94A3B8" }}>
            Development
          </Typography>
        </Toolbar>
      </AppBar>

      <Outlet />
    </Box>
  );
}
