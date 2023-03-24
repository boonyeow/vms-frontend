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
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from "@mui/material";
import axios from "axios";
import { react, useEffect, useState, useReducer } from "react";
import { useAuthStore } from "../../store";
import Swal from "sweetalert2";
// import { TableHead, TableHeadCell, TableHeadRow } from "mui-datatables";

const AssignWorkflowModal = (props) => {
  const { token } = useAuthStore();
  const [userList, setUserList] = useState([]);
  const [currList, setCurrList] = useState([]);
  const [selected, setSelected] = useState([]);
  const workflow = props.workflow;

  useEffect(() => {
    fetchUserList();
  }, []);

  useEffect(() => {
    fetchExistingUserList();
    setSelected(currList);
  }, [workflow]);

  // useEffect(() => {
  //   setSelected(currList);
  // }, [currList]);

  const fetchUserList = async () => {
    axios
      .get(process.env.REACT_APP_ENDPOINT_URL + "/api/accounts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Fetched overall user list.")
        setUserList(res.data);
        console.log(res.data);
      })
      .catch((e) => console.error(e));
  };

  const fetchExistingUserList = async () => {
    console.log("Fetching current selection's user list...")
    axios
      .get(process.env.REACT_APP_ENDPOINT_URL + "/api/workflows/" + workflow.id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Fetched current selection's user list.")
        setCurrList(res.data.authorizedAccountIds);
        console.log(res.data.authorizedAccountIds);
      })
      .catch((e) => console.error(e));
  };

  const setNewUserList = async () => {

    currList.map((select, k) => {
      if (!selected.includes(select)) {
        console.log("Deauthorizing: " + select);
        axios
        .delete(process.env.REACT_APP_ENDPOINT_URL + "/api/workflows/" + workflow.id + "/authorizedAccount", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            accountId: select,
          }
          
        })
        .then((res) => {
        })
        .catch((e) => console.error(e));
    }
    
  })

    // console.log(selected);
    selected.map((select, k) => {
      if (!currList.includes(select)) {
        console.log("Authorizing: " + select);
      axios
      .post(process.env.REACT_APP_ENDPOINT_URL + "/api/workflows/" + workflow.id + "/authorizedAccount", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          accountId: select,
        }
      })
      .then((res) => {
      })
      .catch((e) => console.error(e));
    }})

    }
    
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

      console.log(selected);
      setNewUserList();
    
  };

  return (
    <Dialog
      component="form"
      onSubmit={props.handleSubmit}
      open={props.open}
      onClose={props.onClose}>
      <DialogTitle>Workflow Assignment</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Select/Deselect users to assign/deassign them from a workflow.
        </DialogContentText>
        <TableContainer>
          <Table size="small"> {/*sx={{ minWidth: 650 }}*/}
            <TableHead><TableRow>
              <TableCell>USERS</TableCell>
              <TableCell>ID</TableCell>
            </TableRow></TableHead>
            
            <TableBody>
              {userList.map((user) => (
                props.userTypes.includes(user.accountType)) && (<TableRow
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
              </TableRow>)
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Close</Button>
        <Button onClick={handleSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

AssignWorkflowModal.defaultProps = {
  userTypes : ["ADMIN"],
  workflow : 0,
}

export default AssignWorkflowModal;

