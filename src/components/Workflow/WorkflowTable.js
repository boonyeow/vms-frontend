import { Button, Chip, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { useAuthStore } from "../../store";
import axios from "axios";
import Swal from "sweetalert2";

const WorkflowTable = ({ data, dataLoaded, fetchWorkflows }) => {
  const { token } = useAuthStore();
  //console.log("data", data);
  let rows = data;
  let columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "progress",
      headerName: "Progress",
      renderCell: (params) => {
        return params.row.progress + "%";
      },
    },
    {
      field: "final",
      headerName: "Status",
      minWidth: 150,
      renderCell: (params) => {
        let isFinal = params.row["final"];
        if (isFinal === true) {
          return (
            <Chip
              label={"Published"}
              sx={{
                bgcolor: "#e8f4ff",
                color: "primary.main",
                bgcolor: "#e8f4ff",
                color: "primary.main",
                fontWeight: "bold",
              }}
            ></Chip>
          );
        } else {
          return (
            <Chip
              label={"Draft"}
              sx={{
                fontWeight: "bold",
              }}
            ></Chip>
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
        const handleDelete = () => {
          const currentRow = params.row;
          Swal.fire({
            title: "Deleting Workflow",
            icon: "warning",
            showDenyButton: true,
            confirmButtonText: "Yes, delete it!",
            confirmButtonColor: "#317ecf",
            denyButtonText: "No",
            text: "Are you sure you want to delete?",
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              axios
                .delete(
                  process.env.REACT_APP_ENDPOINT_URL +
                    "/api/workflows/" +
                    currentRow["id"],
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                )
                .then((res) => {
                  Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: "Workflow has been deleted.",
                    confirmButtonColor: "#262626",
                  });
                  fetchWorkflows();
                })
                .catch((e) => {
                  console.log(e);
                });
            }
          });
        };

        return (
          <Stack direction="row" spacing={2}>
            <Button
              href={"/workflow/" + params.row["id"]}
              variant="contained"
              color="action"
              size="small"
            >
              View
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              disabled={params.row["final"]}
              onClick={handleDelete}
            >
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

export default WorkflowTable;
