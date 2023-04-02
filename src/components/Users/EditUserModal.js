import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stack,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useEffect, useReducer } from "react";
import { useAuthStore } from "../../store";
import Swal from "sweetalert2";
const EditUserModal = ({ open, onClose, onUserUpdate, data }) => {
  const { token } = useAuthStore();
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "name":
          return { ...state, name: action.payload };
        case "email":
          return { ...state, email: action.payload };
        case "company":
          return { ...state, company: action.payload };
        case "accountType":
          return { ...state, accountType: action.payload };
        case "contactNumber":
          return { ...state, contactNumber: action.payload };
        case "natureOfBusiness":
          return { ...state, natureOfBusiness: action.payload };
        case "registrationNumber":
          return { ...state, registrationNumber: action.payload };
        case "gstRegistrationNumber":
          return { ...state, gstRegistrationNumber: action.payload };
        case "init":
          return action.payload;
        default:
          return state;
      }
    },
    {
      email: null,
      name: null,
      company: null,
      contactNumber: null,
      natureOfBusiness: null,
      registrationNumber: null,
      gstRegistrationNumber: null,
    }
  );

  useEffect(() => {
    dispatch({
      type: "init",
      payload: {
        name: data?.name,
        email: data?.email,
        company: data?.company,
        contactNumber: data?.contactNumber,
        natureOfBusiness: data?.natureOfBusiness,
        registrationNumber: data?.registrationNumber,
        gstRegistrationNumber: data?.gstRegistrationNumber,
      },
    });
  }, [data]);

  const handleInputChange = (event) => {
    dispatch({ type: event.target.id, payload: event.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!state.name || !state.email || !state.company) {
      alert("oi");
      return; // required attribute in place, so it shouldn't reach this path
    }

    axios
      .put(
        process.env.REACT_APP_ENDPOINT_URL + "/api/accounts",
        {
          id: data.id,
          ...state,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            ContentType: "application/json",
          },
        }
      )
      .then((res) => {
        onUserUpdate(); // refresh userlist
        onClose();
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "User detail has been updated.",
          confirmButtonColor: "#262626",
        });
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Unexpected error.",
          confirmButtonColor: "#262626",
        });
        console.error(e);
      });
  };

  return (
    <Dialog
      component="form"
      onSubmit={handleSubmit}
      open={open}
      onClose={onClose}
    >
      <DialogTitle>Edit user details</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please update user details accordingly.
        </DialogContentText>

        <Stack spacing={3}>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            fullWidth
            variant="standard"
            value={state.name ?? ""}
            onChange={handleInputChange}
            required
          />
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={state.email ?? ""}
            onChange={handleInputChange}
            required
          />
          <TextField
            autoFocus
            margin="dense"
            id="contactNumber"
            label="Contact Number"
            fullWidth
            variant="standard"
            value={state.contactNumber ?? ""}
            onChange={handleInputChange}
            required
          />
          <TextField
            autoFocus
            margin="dense"
            id="company"
            label="Company"
            fullWidth
            variant="standard"
            value={state.company ?? ""}
            onChange={handleInputChange}
            required
          />
          <TextField
            autoFocus
            margin="dense"
            id="natureOfBusiness"
            label="Nature of Business"
            fullWidth
            variant="standard"
            value={state.natureOfBusiness ?? ""}
            onChange={handleInputChange}
            required
          />
          <TextField
            autoFocus
            margin="dense"
            id="registrationNumber"
            label="Registration Number"
            fullWidth
            variant="standard"
            value={state.registrationNumber ?? ""}
            onChange={handleInputChange}
            required
          />
          <TextField
            autoFocus
            margin="dense"
            id="gstRegistrationNumber"
            label="GST Registration Number"
            fullWidth
            variant="standard"
            value={state.gstRegistrationNumber ?? ""}
            onChange={handleInputChange}
            required
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserModal;
