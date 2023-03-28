import NavBar from "../components/SharedComponents/NavBar";
import { Box, Button, Chip, Grid, Typography } from "@mui/material";
import { Container, Stack } from "@mui/system";
import { useAuthStore } from "../store";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
        console.log(res.data);
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
          <Box sx={{ p: 1 }}>
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

const WorkflowTable = ({ data, dataLoaded }) => {
  //console.log("data", data);
  let rows = data;
  let columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "progress",
      headerName: "Progress",
    },
    {
      field: "final",
      headerName: "Status",
      minWidth: 150,
      renderCell: (params) => {
        let isFinal = params.row["final"];
        console.log(isFinal);
        if (isFinal === true) {
          return (
            <Chip
              label={"Published"}
              sx={{
                bgcolor: "#e8f4ff",
                color: "primary.main",
                fontWeight: "bold",
              }}></Chip>
          );
        } else {
          return (
            <Chip
              label={"Draft"}
              sx={{
                fontWeight: "bold",
              }}></Chip>
          );
        }
      },
    },
    {
      field: "actions",
      minWidth: 200,
      headerName: "Action",
      sortable: false,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        const onClick = (e) => {
          const currentRow = params.row;
        };

        return (
          <Stack direction="row" spacing={2}>
            <Button
              href={"/workflow/" + params.row["id"]}
              variant="contained"
              color="action"
              size="small">
              View
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={onClick}>
              Delete
            </Button>
          </Stack>
        );
      },
    },
  ];

  //console.log("rows", rows);
  //console.log("columns", columns);
  return (
    <>
      {dataLoaded ? ( // only render DataGrid if data has finished loading
        <DataGrid
          sx={{ bgcolor: "white", p: 2, borderRadius: 3 }}
          rows={rows}
          columns={columns}
          autoHeight
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableRowSelectionOnClick
        />
      ) : (
        <Typography variant="body1">Loading...</Typography> // show loading message if data is not loaded yet
      )}
    </>
  );
};
export default HomePage;
