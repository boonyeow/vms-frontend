import { Button, Chip, Link, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
const UserTable = ({
  data,
  dataLoaded,
  authorizedUsers,
  setAuthorizedUsers,
}) => {
  const removeUser = (accountId) => {
    setAuthorizedUsers(authorizedUsers.filter((i) => i !== accountId));
  };

  let rows = data;
  let columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      renderCell: (params) => {
        return (
          <Link
            href={"mailto:" + params.row["email"] + "?subject=hey buddy."}
            underline="none">
            {params.row["email"]}
          </Link>
        );
      },
    },
    { field: "company", headerName: "Company", minWidth: 200 },
    {
      field: "accountType",
      headerName: "Type",
      minWidth: 150,
      renderCell: (params) => {
        return (
          <Chip
            label={params.row["accountType"]}
            sx={{
              bgcolor: "#e8f4ff",
              color: "primary.main",
              fontWeight: "bold",
            }}></Chip>
        );
      },
    },
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
                removeUser(params.row["id"]);
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

export default UserTable;
