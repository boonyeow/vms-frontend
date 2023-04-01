import NavBar from "../components/SharedComponents/NavBar";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuthStore } from "../store";
import { useNavigate } from "react-router-dom";
import { Box, Button, Chip, Grid, Tab, Tabs, Typography } from "@mui/material";
import { Container, Stack } from "@mui/system";
import PastSubmissionDataGrid from "../components/PastSubmissionDataGrid";

const PastSubmissions = () => {
  return (
    <Box>
      <NavBar />
      <Container component="main" maxWidth="lg" sx={{ p: 5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}>
          <Typography component="h1" variant="h4" fontWeight="bold">
            Submission History
          </Typography>
        </Box>
        <Box sx={{ my: 2, py: 1 }}>
          <PastSubmissionDataGrid />
        </Box>
      </Container>
    </Box>
  );
};

export default PastSubmissions;
