import { Button, Chip, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";

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
        //console.log(isFinal);
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
