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
import Swal from "sweetalert2";
import { useAuthStore } from "../store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const LoginPage = () => {
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { token, setToken } = useAuthStore();

  useEffect(() => {
    // *****to uncomment later on
    // if (token != null) {
    //   // not null = we assume they logged in so redirect to home
    //   // not the proper way to do things but it works...
    //   navigate("/home");
    // }
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(process.env.REACT_APP_ENDPOINT_URL + "/api/auth/authenticate", {
        email: userEmail,
        password: password,
      })
      .then((res) => {
        // Login successful
        setToken(res.data);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Redirecting...",
          showConfirmButton: false,
          confirmButtonColor: "#262626",
          timer: 1500,
        }).then(() => navigate("/home"));
      })
      .catch((e) => {
        console.log(e);
        // Login failed
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "The email or password is incorrect.",
          showCloseButton: true,
          showConfirmButton: false,
        });
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        <Avatar sx={{ m: 2, width: "75px", height: "75px" }}></Avatar>

        <Typography component="h1" variant="h5" fontWeight="bold">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Box>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />
          </Box>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="action"
            size="large"
            sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
