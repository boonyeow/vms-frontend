import { Chip, IconButton, Link } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useAuthStore } from "../../store";
import { useState } from "react";
import EditUserModal from "../Users/EditUserModal";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box } from "@mui/system";

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

  return (
    <>
      <Box mt={2} pt={3} pb={5} px={5} bgcolor="white" borderRadius="0.5rem">
        <Table sx={{ border: 0 }}>
          <TableHead>
            <TableRow>
              {["#", "Name", "Email", "Company", "Role", "Actions"].map(
                (col) => (
                  <TableCell
                    key={col}
                    sx={{
                      color: "grey.500",
                      fontWeight: "semibold",
                    }}>
                    {col}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody sx={{ color: "action.lighter" }}>
            {data &&
              data.map((row, index) => {
                return (
                  <TableRow
                    hover
                    key={row.name}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}>
                    <TableCell
                      sx={{ color: "action.dark", fontWeight: "500" }}
                      component="th"
                      scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell sx={{ color: "action.dark", fontWeight: "500" }}>
                      {row.name}
                    </TableCell>
                    <TableCell sx={{ fontWeight: "500" }}>
                      <Link href={"mailto:" + row.email} underline="none">
                        {row.email}
                      </Link>
                    </TableCell>
                    <TableCell sx={{ color: "action.dark", fontWeight: "500" }}>
                      {row.company}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.accountType}
                        sx={{
                          bgcolor: "#e8f4ff",
                          color: "primary.main",
                          fontWeight: "bold",
                        }}></Chip>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <IconButton
                          aria-label="edit"
                          color="primary"
                          disabled={row.email == email ? true : false}
                          onClick={() => {
                            editUser(row);
                          }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton aria-label="delete" color="error" disabled>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            <TableRow></TableRow>
          </TableBody>
        </Table>
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
