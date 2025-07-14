"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Alert,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Importar componentes de análisis
import OverviewTab from "./components/OverviewTab";
import UsersTab from "./components/UsersTab";
import ConversationsTab from "./components/ConversationsTab";
import InteractionsTab from "./components/InteractionsTab";
import ConversionsTab from "./components/ConversionsTab";
import InventoryTab from "./components/InventoryTab";
import AdminNavbar from "../components/AdminNavbar";
import HealthTab from "./components/HealthTab";

// Importar hook
import { useBotPerformance } from "@/hooks/botPerformance/useBotPerformance";

// Styled components
const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(3),
  "& .MuiTab-root": {
    minHeight: 64,
    fontSize: "1rem",
    fontWeight: 500,
  },
}));

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`bot-performance-tabpanel-${index}`}
    aria-labelledby={`bot-performance-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const BotPerformancePage = () => {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [period, setPeriod] = useState("30d");
  const { loading, error } = useBotPerformance();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  const tabs = [
    { label: "Vista General", component: OverviewTab },
    { label: "Usuarios", component: UsersTab },
    { label: "Conversaciones", component: ConversationsTab },
    { label: "Interacciones", component: InteractionsTab },
    { label: "Conversiones", component: ConversionsTab },
    { label: "Inventario", component: InventoryTab },
    { label: "Salud del Sistema", component: HealthTab },
  ];

  return (
    <>
      <AdminNavbar currentTab={1} onTabChange={setTabValue} />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Análisis de Performance del Bot
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitoreo y análisis completo del chatbot inmobiliario
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Main Content */}
        <Paper elevation={2} sx={{ borderRadius: 2 }}>
          {/* Tabs Navigation */}
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <StyledTabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="bot performance tabs"
              variant="scrollable"
              scrollButtons="auto"
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  label={tab.label}
                  id={`bot-performance-tab-${index}`}
                  aria-controls={`bot-performance-tabpanel-${index}`}
                />
              ))}
            </StyledTabs>
          </Box>

          {/* Tab Content */}
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="400px"
            >
              <CircularProgress />
            </Box>
          ) : (
            tabs.map((tab, index) => {
              const TabComponent = tab.component;
              return (
                <TabPanel key={index} value={activeTab} index={index}>
                  <TabComponent
                    period={period}
                    onPeriodChange={handlePeriodChange}
                  />
                </TabPanel>
              );
            })
          )}
        </Paper>
      </Container>
    </>
  );
};

export default BotPerformancePage;
