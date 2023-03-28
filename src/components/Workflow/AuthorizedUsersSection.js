import { Autocomplete, Button, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import UserTable from "./UserTable";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const AuthorizedUsersSection = ({
  userList,
  authorizedUsers,
  setAuthorizedUsers,
}) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [authorizedUserData, setAuthorizedUserData] = useState([]);

  console.log("authorizedUsers", authorizedUsers);
  useEffect(() => {
    if (authorizedUsers != undefined) {
      setAuthorizedUserData(
        userList.filter((item) => authorizedUsers.includes(item.id))
      );
    }
  }, [authorizedUsers]);
  const handleAddUser = () => {
    if (authorizedUsers?.includes(selectedUser["id"])) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "User is already in allowlist",
        confirmButtonColor: "#262626",
      });
      return;
    }
    setAuthorizedUsers([...authorizedUsers, selectedUser["id"]]);
  };

  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ color: "action.main", alignSelf: "center" }}>
          Allowlist
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Autocomplete
            value={selectedUser}
            onChange={(event, newValue) => {
              setSelectedUser(newValue);
            }}
            id="controllable-states-demo"
            options={userList}
            getOptionLabel={(option) => option["email"]}
            sx={{ width: 300, bgcolor: "white", mr: 2 }}
            renderInput={(params) => (
              <TextField {...params} label="Search User" />
            )}
            size="small"
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ my: 2 }}
            color="action"
            onClick={handleAddUser}>
            Add User
          </Button>
        </Box>
      </Box>

      <Box sx={{ my: 2 }}>
        <UserTable
          data={authorizedUserData}
          dataLoaded={true}
          authorizedUsers={authorizedUsers}
          setAuthorizedUsers={setAuthorizedUsers}
        />
      </Box>
    </Box>
  );
};
export default AuthorizedUsersSection;
