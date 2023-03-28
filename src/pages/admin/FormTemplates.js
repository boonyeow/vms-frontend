import NavBar from "../../components/SharedComponents/NavBar";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Select,
  DialogActions,
} from "@mui/material";

const FormTemplates = () => {
  const { token } = useAuthStore();
  const [regexList, setRegexList] = useState([]);
  const navigate = useNavigate();


  function AuthorizedAccountsCell({ value }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleChipClick = (event) => {
      setAnchorEl(event.currentTarget);
      };

   const handleClose = () => {
      setAnchorEl(null);
        };

    const chips = value.map((account, index) => (
      <>
        {index < 3 ? (
          <Chip size="small" key={index} label={account.name} />
        ) : index === 3 ? (
          <Chip
            size="small"
            key={index}
            label={`+${value.length - 3}`}
            onClick={handleChipClick}
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          />
        ) : null}
      </>
    ));

    const dropdownItems = value.slice(3).map((account) => (
      <MenuItem  key={account.id}>
      {account.name}
      </MenuItem>
    ));

    return (
      <div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>{chips}</div>
        <div>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            onClose={handleClose}
            open={open}
          >
            {dropdownItems}
          </Menu>
        </div>
      </div>
    );
  }

  const [openDialog, setOpenDialog] = useState(false);
  const [targetForm, setTargetForm] = useState(null);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setAuthorizedUserList([]);
  };
  const handleNewAuthorizedUsers =async () => {
      await axios
        .put(
          process.env.REACT_APP_ENDPOINT_URL +
            `/api/forms/${targetForm.id}/${targetForm.revisionNo}/authorizedAccount`,
          authorizedUserList,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
           setOpenDialog(false);
        })
        .catch((e) => console.error(e));

  };
  function ActionCell({ row, fetchFormsList, token, navigate, setTargetForm }) {
    const handleEditAuthAcc = async (e) => {
      const target = row;
      setTargetForm(target);
      setAuthorizedUserList(target.authorizedAccounts.map((obj)=>obj.email));
      setOpenDialog(true);
    };

    const onViewClick = (e) => {
      const formId = row.id;
      const formRevNo = row.revisionNo;
      navigate("/FormCreation/" + formId + "/" + formRevNo);
    };

    const onDeleteClick = async (e) => {
      const targetForm = row;

      await axios
        .delete(
          process.env.REACT_APP_ENDPOINT_URL +
            `/api/forms/${targetForm.id}/${targetForm.revisionNo}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log("deleted", res.data);
          fetchFormsList();
        })
        .catch((e) => {
          console.log(e);
        });
    };

    const onDuplicateClick = async (e) => {
      const targetForm = row;

      await axios
        .post(
          process.env.REACT_APP_ENDPOINT_URL +
            `/api/forms/${targetForm.id}/${targetForm.revisionNo}/duplicate`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log("duplicated", res.data);
          fetchFormsList();
        })
        .catch((e) => {
          console.log(e);
        });
    };

    return (
      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={onViewClick}
        >
          View
        </Button>
        <Button
          variant="outlined"
          color="warning"
          size="small"
          onClick={onDuplicateClick}
        >
          Duplicate
        </Button>
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={onDeleteClick}
        >
          Delete
        </Button>
        <Button
          variant="outlined"
          color="success"
          size="small"
          onClick={handleEditAuthAcc}
        >
          Edit Authorized Acc
        </Button>
      </Stack>
    );
  }

const columns = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "revisionNo", headerName: "Revision No.", width: 150 },
  { field: "name", headerName: "Name", width: 180 },
  {
    field: "authorizedAccounts",
    headerName: "Authorized Accounts",
    width: 260,
    renderCell: (params) => <AuthorizedAccountsCell value={params.value} />,
  },
  {
    field: "action",
    headerName: "Action",
    width: 450,
    sortable: false,
    headerAlign: "center",
    disableClickEventBubbling: true,
    renderCell: (params) => (
      <ActionCell
        row={params.row}
        fetchFormsList={fetchFormsList}
        token={token}
        navigate={navigate}
        openDialog
        ={openDialog}
      setTargetForm={setTargetForm}
      />
    ),
  },
];
  const [formList, setFormList] = useState([]);
  const [formListOriginal, setFormListOriginal] = useState([]);
  const fetchFormsList = async () => {
    axios
      .get(process.env.REACT_APP_ENDPOINT_URL + "/api/forms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setFormListOriginal(res.data)
        const data = res.data.map((obj) => {
          return Object.entries(obj).reduce((acc, [key, value]) => {
            if (typeof value === "object" && !Array.isArray(value)) {
              // If the value is an object, spread its properties into the accumulator
              acc = { ...acc, ...value };
            } else {
              // Otherwise, add the property to the accumulator as is
              acc[key] = value;
            }
            return acc;
          }, {});
        });
        setFormList(data);
      })
      .catch((e) => console.error(e));
  };
    const [authorizedUserList, setAuthorizedUserList] = useState([]);
   const handleChange = (event) => {
     const {
       target: { value },
     } = event;
     const newAuthorizedUserList = [...authorizedUserList];

     value.forEach((selectedOption) => {
       if (!newAuthorizedUserList.includes(selectedOption)) {
         newAuthorizedUserList.push(selectedOption);
       }
     });

     newAuthorizedUserList.forEach((existingOption, index) => {
       if (!value.includes(existingOption)) {
         newAuthorizedUserList.splice(index, 1);
       }
     });

     const newAuthorizedAccounts = newAuthorizedUserList.map((user) => user.id);

     setAuthorizedUserList(newAuthorizedUserList);

   };

 const [userList, setUserList] = useState([]);
  useEffect(() => {
    fetchFormsList();
    //fetchForms();
    fetchUserList();
    fetchRegexList();
  }, []);
  const fetchUserList = async () => {
    axios
      .get(process.env.REACT_APP_ENDPOINT_URL + "/api/accounts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUserList(res.data);
      })
      .catch((e) => console.error(e));
  };

   const fetchRegexList = async () => {
     await axios
       .get(process.env.REACT_APP_ENDPOINT_URL + "/api/regex", {
         headers: {
           Authorization: `Bearer ${token}`,
         },
       })
       .then((res) => {
       //  console.log(res.data);
         setRegexList(res.data);
       })
       .catch((e) => console.error(e));
   };


  const handleCreateForm = async () => {
    await axios
      .post(
        process.env.REACT_APP_ENDPOINT_URL + "/api/forms",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
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
      <h1 style={{ textAlign: "center" }}>Form Templates</h1>

      <Stack spacing={2} alignItems="center">
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleCreateForm}
          >
            Create New
          </Button>
        </Stack>
        <div
          style={{ height: 500, maxWidth: "100%", backgroundColor: "white" }}
        >
          <DataGrid
            rows={formList}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            autoHeight
            getRowId={(row) => row.id + row.revisionNo}
            slots={{
              toolbar: GridToolbar,
            }}
          />
        </div>
      </Stack>
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>Edit Authorized Accounts</DialogTitle>
        <DialogContent>
          <Select
            fullWidth
            value={authorizedUserList}
            onChange={handleChange}
            multiple
            // renderValue={(selected) => (
            //   <div>
            //     {selected.map((value) => (
            //       <Chip key={value.name} label={value.name} />
            //     ))}
            //   </div>
            // )}
          >
            {userList.map((user) => (
              <MenuItem key={user.id} value={user.email}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleNewAuthorizedUsers}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default FormTemplates;
