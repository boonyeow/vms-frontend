import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Stack,
  TextField,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { useReducer } from "react";
import Swal from "sweetalert2";
import { useAuthStore } from "../../store";
const AddUserModal = ({ open, onClose, onUserAdded }) => {
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
        default:
          return state;
      }
    },
    {
      name: "",
      email: "",
      company: "",
      accountType: "",
      password: "blopblopblop",
    }
  );

  const handleInputChange = (event) => {
    dispatch({ type: event.target.id, payload: event.target.value });
  };

  const handleSelectChange = (event) => {
    console.log(event.target.value);
    // dispatch({ type: event.target.id, payload: event.target.value });
    dispatch({ type: "accountType", payload: event.target.value });
    console.log(state);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!state.name || !state.email || !state.company || !state.accountType) {
      alert("oi");
      return; // required attribute in place, so it shouldn't reach this path
    }

    console.log(state);

    axios
      .post(process.env.REACT_APP_ENDPOINT_URL + "/api/auth/register", state, {
        headers: {
          Authorization: `Bearer ${token}`,
          ContentType: "application/json",
        },
      })
      .then((res) => {
        onUserAdded(); // refresh userlist
        onClose();
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Account has been created.",
          confirmButtonColor: "#262626",
        });
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Existing account exists.",
          confirmButtonColor: "#262626",
        });
      });
  };

  return (
    <Dialog
      component="form"
      onSubmit={handleSubmit}
      open={open}
      onClose={onClose}>
      <DialogTitle>Add a new user</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To add a new user on VMS, please fill in the following details.
        </DialogContentText>

        <Stack spacing={3}>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            fullWidth
            variant="standard"
            value={state.name}
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
            value={state.email}
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
            value={state.company}
            onChange={handleInputChange}
            required
          />
          <FormControl variant="filled" fullWidth>
            <InputLabel id="demo-simple-select-filled-label">Role</InputLabel>
            <Select
              id="accountType"
              value={state.accountType}
              onChange={handleSelectChange}
              required>
              <MenuItem value="VENDOR">Vendor</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="APPROVER">Approver</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserModal;
