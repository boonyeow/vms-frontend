import { Box, Container } from "@mui/system";
import NavBar from "../../components/SharedComponents/NavBar";
import WorkflowList from "../../components/Workflow/WorkflowList";

import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store";
import { Button, Typography } from "@mui/material";
import axios from "axios";
import WorkflowTable from "../../components/Workflow/WorkflowTable";
import AddIcon from "@mui/icons-material/Add";
import Swal from "sweetalert2";

const WorkflowMgmt = () => {
  const { accountId, token, email, role } = useAuthStore();
  const navigate = useNavigate();
  const [workflowData, setWorkflowData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false); // initialize dataLoaded state variable to false

  useEffect(() => {
    if (role !== "ADMIN") {
      navigate("/home");
    }
  }, [role]);

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

  const handleCreateWorkflow = () => {
    axios
      .post(process.env.REACT_APP_ENDPOINT_URL + "/api/workflows", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        fetchWorkflows();
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Workflow has been created.",
          confirmButtonColor: "#262626",
        });
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
            Workflow
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ my: 2 }}
            color="action"
            onClick={handleCreateWorkflow}>
            Add New Workflow
          </Button>
        </Box>
        <Box sx={{ py: 2 }}>
          <WorkflowTable
            data={workflowData}
            dataLoaded={dataLoaded}
            fetchWorkflows={fetchWorkflows}
          />
        </Box>
      </Container>
    </Box>
  );
};
export default WorkflowMgmt;
