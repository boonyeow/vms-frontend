import NavBar from "../components/SharedComponents/NavBar";
import { Box, Button, Chip, Grid, Tab, Tabs, Typography } from "@mui/material";
import { Container, Stack } from "@mui/system";
import { useAuthStore } from "../store";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WorkflowTable from "../components/Workflow/WorkflowTable";
import TabComponent from "../components/TabComponent";
import ReminderEmailButton from "../components/ReminderEmailButton";

const HomePage = () => {
  const { accountId, token, email, role } = useAuthStore();
  return (
    <Box>
      <NavBar />
      <Container component="main" maxWidth="lg" sx={{ p: 5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            fontWeight="bold"
            sx={{ color: "action.main", alignSelf: "center" }}
          >
            Home
          </Typography>
          {role === "ADMIN" || role === "APPROVER" ? (
            <ReminderEmailButton />
          ) : null}
        </Box>
        <TabComponent role={role} />
      </Container>
    </Box>
  );
};

export default HomePage;
