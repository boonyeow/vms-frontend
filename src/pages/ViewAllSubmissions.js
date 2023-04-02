import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store";
import NavBar from "../components/SharedComponents/NavBar";
import { Box, Container } from "@mui/system";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ViewAllSubmissions = () => {
  const { token, accountId, role } = useAuthStore();
  const [formSubmissions, setFormSubmissions] = useState([]);
  const navigate = useNavigate();

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 1,
    },
    {
      field: "workflow",
      headerName: "Workflow ID",
      valueGetter: (params) => {
        return params.row.workflow.id;
      },
    },
    {
      field: "form",
      headerName: "Form Name",
      valueGetter: (params) => params.row.form.name,
      minWidth: 150,
      flex: 1,
    },
    {
      field: "submittedBy",
      headerName: "Submitted By",
      valueGetter: (params) => params.row.submittedBy.email,
      minWidth: 200,
    },
    {
      field: "status",
      width: 150,
      headerName: "Status",
      renderCell: (params) => {
        let color = "";
        let backgroundColor = "";
        switch (params.row.status) {
          case "AWAITING_APPROVER":
          case "AWAITING_ADMIN":
            color = "orange";
            break;
          case "APPROVED":
            color = "green";
            break;
          case "REJECTED":
            color = "red";
            break;
          case "NOT SUBMITTED":
            break;
          default:
            break;
        }
        return (
          <div style={{ color: color, backgroundColor: backgroundColor }}>
            {params.row.status}
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 125,
      sortable: false,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        const onClick = (e) => {
          console.log(params.row);
          //   return;
          navigate(
            `/formsubmission/${params.row.form.id.id}/${params.row.form.id.revisionNo}/${params.row.id}`
          );
        };
        return (
          <Button
            variant="contained"
            color="action"
            size="small"
            onClick={onClick}
          >
            View
          </Button>
        );
      },
    },
  ];

  const fetchAllFormSubmissions = async () => {
    await axios
      .get(`${process.env.REACT_APP_ENDPOINT_URL}/api/formsubmission`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setFormSubmissions(res.data);
      });
  };

  useEffect(() => {
    fetchAllFormSubmissions();
  }, []);
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
            All Submissions
          </Typography>
        </Box>
        <Box sx={{ height: 500, width: "100%", my: 2, py: 1 }}>
          {formSubmissions ? ( // only render DataGrid if data has finished loading
            <DataGrid
              sx={{ bgcolor: "white", p: 2, borderRadius: 3 }}
              rows={formSubmissions}
              columns={columns}
              disableRowSelectionOnClick
              slots={{
                toolbar: GridToolbar,
              }}
            />
          ) : (
            <Typography variant="body1">Loading...</Typography> // show loading message if data is not loaded yet
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default ViewAllSubmissions;
