import NavBar from "../components/SharedComponents/NavBar";
import { Box, Button, Chip, Grid, Typography } from "@mui/material";
import { Container, Stack } from "@mui/system";
import { useAuthStore } from "../store";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WorkflowTable from "../components/Workflow/WorkflowTable";

const HomePage = () => {
  const { accountId, token, email, role } = useAuthStore();
  const [workflowData, setWorkflowData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false); // initialize dataLoaded state variable to false
  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = () => {
    let url = null;
    if (role !== "VENDOR") {
      url = process.env.REACT_APP_ENDPOINT_URL + "/api/workflows";
    } else {
      url =
        process.env.REACT_APP_ENDPOINT_URL +
        "/api/workflows/getWorkflowsByAccountId/" +
        accountId;
    }
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setWorkflowData(res.data);
        setDataLoaded(true);
      });
  };

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
            sx={{ color: "action.main", alignSelf: "center" }}>
            Home
          </Typography>
        </Box>
        <Box sx={{ py: 1 }}>
          {/* <Box sx={{ p: 1 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#1f1f1f" }}>
              Action Items
            </Typography>
          <WorkflowTable data={workflowData} dataLoaded={dataLoaded} />
          </Box> */}
          <Box sx={{ py: 1 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#1f1f1f", mb: 1 }}>
              Workflow
            </Typography>
            <WorkflowTable data={workflowData} dataLoaded={dataLoaded} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
export default HomePage;
