import { Chip, IconButton, Link } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useAuthStore } from "../../store";
import { useState, useEffect } from "react";
import EditUserModal from "../Users/EditUserModal";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
// import { Box } from "@mui/system";
import { Subject } from "@mui/icons-material";

import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Stack from "@mui/material/Stack";

const UserList = ({ data, onUserUpdate }) => {
  const { email } = useAuthStore();
  const [currentUserData, setCurrentUserData] = useState({});
  const [open, setOpen] = useState(false);

  const editUser = (data) => {
    setCurrentUserData(data);
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason && reason == "backdropClick") return;
    setOpen(false);
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 1,
    },
    {
      field: "name",
      headerName: "Name",
      width: 120,
    },
    {
      field: "email",
      headerName: "Email",
      width: 160,
    },
    {
      field: "company",
      headerName: "Company",
      width: 160,
    },
    {
      field: "accountType",
      headerName: "Account Type",
      width: 120,
    },
    {
      field: "contactNumber",
      headerName: "Contact No.",
      width: 100,
      sortable: false,
    },
    {
      field: "businessNature",
      headerName: "Nature of Biz",
      width: 120,
    },
    {
      field: "registrationNo",
      headerName: "Registration No.",
      width: 130,
      sortable: false,
    },
    {
      field: "gstNo",
      headerName: "GST Reg. No.",
      width: 130,
      sortable: false,
    },
    {
      field: "archived",
      headerName: "Archived",
      width: 90,
    },
    {
      field: "action",
      headerName: "Action",
      width: 125,
      sortable: false,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={2}>
            <IconButton
              aria-label="edit"
              color="primary"
              disabled={params.email == email ? true : false}
              onClick={() => {
                editUser(params.id);
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton aria-label="delete" color="error" disabled>
              <DeleteIcon />
            </IconButton>
          </Stack>
        );
      },
    },
  ];

  const [formList, setFormList] = useState([]);
  const fetchFormsList = () => {
    console.log(data);
    const items = [];
    for (const item of data) {
      items.push({
        id: item.id,
        name: item.name,
        email: item.email,
        company: item.company,
        accountType: item.accountType,
        contactNumber: item.contactNumber,
        businessNature: item.natureOfBusiness,
        registrationNo: item.registrationNumber,
        gstNo: item.gstRegistrationNumber,
        archived: item.isArchived,
      });
    }
    setFormList(items);
  };

  useEffect(() => {
    fetchFormsList();
  }, [data]);

  return (
    <>
      <Box style={{ height: 500, width: "100%" }}>
        <DataGrid
          sx={{ bgcolor: "white", p: 2, borderRadius: 3 }}
          rows={formList}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          slots={{
            toolbar: GridToolbar,
          }}
        />
        <EditUserModal
          open={open}
          onClose={handleClose}
          onUserUpdate={onUserUpdate}
          data={currentUserData}
        />
      </Box>
    </>
  );
};
export default UserList;
