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
    <>
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
            sx={{
              color: "action.main",
              alignSelf: "center",
              marginLeft: "110px",
              marginBottom: "15px",
            }}
          >
            Approval History
          </Typography>
        </Box>
        <PastApprovalDataGrid />
      </Container>
    </>
  );
};

export default PastApprovals;
