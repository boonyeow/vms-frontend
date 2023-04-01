import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useAuthStore } from "../store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import NavBar from "../components/SharedComponents/NavBar";
import PastApprovalDataGrid from "../components/PastApprovalDataGrid";

const PastApprovals = () => {
  return (
    <Box>
      <NavBar />
      <Container component="main" maxWidth="lg" sx={{ p: 5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}>
          <Typography
            component="h1"
            variant="h4"
            fontWeight="bold"
            sx={{
              color: "action.main",
            }}>
            Approval History
          </Typography>
        </Box>
        <Box sx={{ my: 2, py: 1 }}>
          <PastApprovalDataGrid />
        </Box>
      </Container>
    </Box>
  );
};

export default PastApprovals;
