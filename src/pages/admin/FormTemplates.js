import NavBar from "../../components/SharedComponents/NavBar";
import { DataGrid } from "@mui/x-data-grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const columns = [
  { field: "id", headerName: "ID", width: 160 },
  { field: "revision", headerName: "Revision No", width: 180 },
  { field: "title", headerName: "Title", width: 180 },
//   {
//     field: "status",
//     headerName: "Status",
//     width: 180,
//     renderCell: (params) => {
//       let color = "";
//       switch (params.value) {
//         case "draft":
//           color = "orange";
//           break;
//         case "published":
//           color = "green";
//           break;
//         default:
//           break;
//       }
//       return <div style={{ color: color }}>{params.value}</div>;
//     },
//   },
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
            color="primary"
            size="small"
            onClick={onClick}
          >
            Edit
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
  { id: 1, revision: "Snow", title: "Jon", status: "published" },
  { id: 2, revision: "Lannister", title: "Cersei", status: "draft" },
  { id: 3, revision: "Lannister", title: "Jaime", status: "published" },
  { id: 4, revision: "Stark", title: "Arya", status: "published" },
  { id: 5, revision: "Targaryen", title: "Daenerys", status: "published" },
  { id: 6, revision: "Melisandre", title: "Daenerys", status: "published" },
  { id: 7, revision: "Clifford", title: "Ferrara", status: "draft" },
  { id: 8, revision: "Frances", title: "Rossini", status: "draft" },
  { id: 9, revision: "Roxie", title: "Harvey", status: "draft" },
];

const FormTemplates = () => {
  return (
    <>
      <NavBar />
      <h1>Form Templates</h1>

      <Stack spacing={2} alignItems="center">
        <Stack direction="row" spacing={2} alignItems="flex-end">
          {/* <Button
            variant="contained"
            color="primary"
            size="small"
            component={Link}
            to="/FormCreation"
          >
            Create New
          </Button>
          <Button variant="contained" color="secondary" size="small">
            Load Draft
          </Button> */}
          <Button
            variant="contained"
            color="secondary"
            size="small"
            component={Link}
            to="/FormCreation"
          >
            Create Form
          </Button>
        </Stack>
        <div style={{ height: 500, maxWidth: "100%" }}>
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
export default FormTemplates;
