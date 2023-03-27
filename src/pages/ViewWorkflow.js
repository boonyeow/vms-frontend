import {
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Input,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Box, Container, Stack } from "@mui/system";
import { useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/SharedComponents/NavBar";
import { DataGrid } from "@mui/x-data-grid";

const ViewWorkflow = (props) => {
  const { id } = useParams();
  const [workflowInfo, setWorkflowInfo] = useState({
    title: "hihi",
    isFinal: false,
  });
  const [dataLoaded, setDataLoaded] = useState(false); // initialize dataLoaded state variable to false
  const fetchWorkflowInfo = () => {};

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
            View Workflow
          </Typography>
        </Box>
        <Box sx={{ my: 2, p: 1 }}>
          <Box sx={{ p: 2 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "#1f1f1f" }}>
              Workflow Title
            </Typography>
            <TextField
              defaultValue="hello"
              sx={{ bgcolor: "white", my: 1 }}
              value={workflowInfo.title}
              disabled={workflowInfo === true ? true : false}></TextField>
          </Box>

          <Box sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ color: "action.main", alignSelf: "center" }}>
                Attached Forms
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                sx={{ my: 2 }}
                color="action"
                onClick={() => {
                  console.log("hi");
                }}>
                Add Form
              </Button>
            </Box>

            <Box sx={{ bgcolor: "white", p: 3, borderRadius: 2 }}>
              <Box>Hello This is form 1</Box>
            </Box>
          </Box>

          <Box sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ color: "action.main", alignSelf: "center" }}>
                Allowlist
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                sx={{ my: 2 }}
                color="action"
                onClick={() => {
                  console.log("hi");
                }}>
                Add User
              </Button>
            </Box>

            <Box sx={{ my: 2 }}>
              <UserTable dataLoaded={true} />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

const UserTable = ({ data, dataLoaded }) => {
  let rows = [
    {
      id: 1,
      name: "hello",
      progress: 0,
      forms: null,
      authorizedAccounts: [
        {
          id: "0",
          name: "John",
          email: "admin@kmail.com",
          company: "Singapore Management University",
          accountType: "VENDOR",
        },
      ],
      authorizedAccountIds: null,
      approvalSequence: null,
      final: false,
    },
  ];
  let columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email" },
    { field: "company", headerName: "Company" },
    { field: "accountType", headerName: "Type" },
    {
      field: "action",
      headerName: "Action",
      minWidth: 200,
      sortable: false,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => {
                console.log("hi");
              }}>
              Delete
            </Button>
          </Stack>
        );
      },
    },
  ];

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

export default ViewWorkflow;
