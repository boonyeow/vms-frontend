import NavBar from "../../components/SharedComponents/NavBar";
import { DataGrid } from "@mui/x-data-grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store";
const columns = [
  { field: "id", headerName: "ID", width: 160 },
  { field: "title", headerName: "Title", width: 180 },
  { field: "vendor", headerName: "Vendor", width: 180 },
  {
    field: "status",
    headerName: "Status",
    width: 180,
    renderCell: (params) => {
      let color = "";
      switch (params.value) {
        case "waiting":
          color = "orange";
          break;
        case "approved":
          color = "green";
          break;
        case "rejected":
          color = "red";
          break;
        default:
          break;
      }
      return <div style={{ color: color }}>{params.value}</div>;
    },
  },
  {
    field: "action",
    headerName: "Action",
    width: 180,
    sortable: false,
    disableClickEventBubbling: true,
    renderCell: (params) => {
      const onClick = (e) => {
        const currentRow = params.row;
        return alert(JSON.stringify(currentRow, null, 4));
      };

      return (
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            color="warning"
            size="small"
            onClick={onClick}
          >
            View
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={onClick}
          >
            Delete
          </Button>
        </Stack>
      );
    },
  },
];

const rows = [
  { id: 1, title: "Snow", vendor: "Jon", status: "waiting" },
  { id: 2, title: "Lannister", vendor: "Cersei", status: "approved" },
  { id: 3, title: "Lannister", vendor: "Jaime", status: "waiting" },
  { id: 4, title: "Stark", vendor: "Arya", status: "waiting" },
  { id: 5, title: "Targaryen", vendor: "Daenerys", status: "approved" },
  { id: 6, title: "Melisandre", vendor: "Daenerys", status: "approved" },
  { id: 7, title: "Clifford", vendor: "Ferrara", status: "approved" },
  { id: 8, title: "Frances", vendor: "Rossini", status: "rejected" },
  { id: 9, title: "Roxie", vendor: "Harvey", status: "rejected" },
];

  const FormMgmt = () => {
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const [formList, setFormList] = useState([]);
  const fetchFormsList = async () => {
   axios
     .get(process.env.REACT_APP_ENDPOINT_URL + "/api/forms", {
       headers: {
         Authorization: `Bearer ${token}`,
       },
     })
     .then((res) => {
       setFormList(res.data);
       console.log(res.data)
     })
     .catch((e) => console.error(e));
 };

 useEffect(() => {
   fetchFormsList();
 }, []);

  const handleCreateForm = async () => {
    await axios
      .post(process.env.REACT_APP_ENDPOINT_URL + "/api/forms", {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // Create form  successful
        console.log("success", res.data);
        navigate("/FormCreation/" + res.data.id + "/" + res.data.revisionNo);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <>
      <NavBar />
      <h1 style={{ textAlign: "center" }}>Form Management</h1>

      <Stack spacing={2} alignItems="center">
        <Stack direction="row" spacing={2} alignItems="flex-end">
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleCreateForm}
            // component={Link}
            // to="/FormCreation"
          >
            Create New
          </Button>
          <Button variant="contained" color="secondary" size="small">
            Load Draft
          </Button>
          <Button variant="contained" color="warning" size="small">
            Send Form
          </Button>
        </Stack>
        <div
          style={{ height: 500, maxWidth: "100%", backgroundColor: "white" }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
          />
        </div>
      </Stack>
    </>
  );
};
export default FormMgmt;
