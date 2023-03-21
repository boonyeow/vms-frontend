// poorly implementation - by RIGHT we should be using AddUserModal (see AddUserModal.js for notes)
// this component exists for the sake of Making It Work.
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,

  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell
} from "@mui/material";
import axios from "axios";
import { react, useEffect, useState, useReducer } from "react";
import { useAuthStore } from "../../store";
import Swal from "sweetalert2";

const AssignWorkflowModal = (props) => {
  const { token } = useAuthStore();
  const [userList, setUserList] = useState([]);
  const [selected, setSelected] = useState([]);
  const workflow = props.workflow;

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
        console.log(res.data);
      })
      .catch((e) => console.error(e));
  };

  const handleClick = (event, row) => {
    const selectedIndex = selected.indexOf(row);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, row);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

    const handleSubmit = (e) => {

      selected.map(
        (user) => {
          axios
        .post(process.env.REACT_APP_ENDPOINT_URL + "/api/workflows/" + workflow.id + "/authorizedAccount", {
            headers: {
                Authorization: `Bearer ${token}`,
                
            },
            params: {
                accountID: user, // account ID
            }
        })
      .then((res) => {
      })
      .catch((e) => {
        console.log(e);
      });
        }
      )
    
  };

  return (
    <Dialog
      component="form"
      onSubmit={props.handleSubmit}
      open={props.open}
      onClose={props.onClose}>
      <DialogTitle>Select An User</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Pick an user from the list.
        </DialogContentText>
        <TableContainer>
          <Table size="small"> {/*sx={{ minWidth: 650 }}*/}
            <TableBody>
              {userList.map((user) => (
                (props.userTypes.includes(user.accountType)) ? <TableRow
                hover
                onClick={(event) => handleClick(event, user.id)}
                role="checkbox"
                tabIndex={-1}
                key={user.id}
                selected={selected.includes(user.id)}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">{user.name}</TableCell>
                <TableCell align="right">{user.id}</TableCell>
              </TableRow>
              : null
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Okay</Button>
      </DialogActions>
    </Dialog>
  );
};

AssignWorkflowModal.defaultProps = {
  userTypes : ["ADMIN"],
}

export default AssignWorkflowModal;

