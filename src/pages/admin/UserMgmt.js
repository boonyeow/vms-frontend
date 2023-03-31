import { useEffect, useState } from "react";
import NavBar from "../../components/SharedComponents/NavBar";
import Box from "@mui/material/Box";
import UserList from "../../components/Users/UserList";
import AddUserModal from "../../components/Users/AddUserModal";
import { Button, Typography } from "@mui/material";
import { Container } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import { useAuthStore } from "../../store";
import axios from "axios";
import "sweetalert2/dist/sweetalert2.min.css";

const UserMgmt = () => {
  const [open, setOpen] = useState(false);
  const { token } = useAuthStore();
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    fetchUserList();
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason && reason === "backdropClick") return;
    setOpen(false);
  };

  return (
    <>
      <Box>
        <NavBar />
        <Container component="main" maxWidth="lg" sx={{ p: 5 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}>
            <Typography
              component="h1"
              variant="h4"
              fontWeight="bold"
              sx={{ color: "action.main", alignSelf: "center" }}>
              Manage Users
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ my: 2 }}
              color="action"
              onClick={handleClickOpen}>
              Add New User
            </Button>
          </Box>

          <UserList data={userList} onUserUpdate={fetchUserList} />

          <AddUserModal
            open={open}
            onClose={handleClose}
            onUserAdded={fetchUserList}
          />
        </Container>
      </Box>
    </>
  );
};
export default UserMgmt;
