import { Button, Chip, IconButton, Link } from "@mui/material";
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
import axios from "axios";
import Swal from "sweetalert2";

const UserList = ({ data, onUserUpdate }) => {
  const { email, token } = useAuthStore();
  const [currentUserData, setCurrentUserData] = useState({});
  const [open, setOpen] = useState(false);

  const editUser = (userId) => {
    console.log(data);
    setCurrentUserData(data.find((x) => x.id === userId));
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
      field: "contactNumber",
      headerName: "Contact No.",
      width: 100,
      sortable: false,
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
              variant="contained"
              color="action"
              size="small"
              disabled={params.email == email ? true : false}
              onClick={() => {
                editUser(params.id);
              }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => {
                axios
                  .put(
                    process.env.REACT_APP_ENDPOINT_URL +
                      "/api/accounts/" +
                      params.id,
                    null,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  )
                  .then((res) => {
                    console.log(res.data);

                    Swal.fire({
                      icon: "success",
                      title: "Archived!",
                      text: `${params.row.email} account has been archived.`,
                      showConfirmButton: true,
                      confirmButtonColor: "#262626",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        window.location.reload();
                      }
                    });
                  })
                  .catch((e) => {
                    console.log(e.message);
                    Swal.fire({
                      icon: "error",
                      title: "Failed to Archive!",
                      text: "Unexpected Error Occurred. Please contact IT if this persists.",
                      showConfirmButton: true,
                      confirmButtonColor: "#262626",
                    });
                  });
              }}
            >
              Delete
            </Button>
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
