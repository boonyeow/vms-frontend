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
import { react, useEffect, useState } from "react";
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
    fetchExistingUserList();
    fetchUserList();
  }, []);

  // should only be executing the one time
  useEffect(() => {
    setSelected(currList);
  }, [currList]);

  const fetchUserList = () => {
    axios
      .get(process.env.REACT_APP_ENDPOINT_URL + "/api/accounts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log("Fetched overall user list.")
        setUserList(res.data);
        // console.log(res.data);
      })
      .catch((e) => console.error(e));
  };

  const fetchExistingUserList = () => {
    // console.log("Fetching current selection's user list...")
    axios
      .get(process.env.REACT_APP_ENDPOINT_URL + "/api/workflows/" + workflow.id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log("Fetched current selection's user list.")
        setCurrList(res.data.authorizedAccountIds);
        // console.log(res.data.authorizedAccountIds);
      })
      .catch((e) => console.error(e));
  };

  const setNewUserList = async () => {

    let err = 0;

    currList.map((select, k) => {
      if (!selected.includes(select)) {
        // console.log("Deauthorizing: " + select);
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
        .catch((e) => err++);
    }
    
  })

    // console.log(selected);
    selected.map((select, k) => {
      if (!currList.includes(select)) {
        // console.log("Authorizing: " + select);
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
      .catch((e) => err++);
    }})

    if (err==0) {
      Swal.fire({
        icon: "success",
        title: "Success!",
        showConfirmButton: false,
        target: document.getElementById('dialoglog'),
        timer: 1000,
      })
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! The operation may not have been completed.",
        target: document.getElementById('dialoglog'),
        timer: 1000,
      })
    }
    

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

      setNewUserList();
    
  };

  return (
    <Dialog
      id="dialoglog"
      component="form"
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
              <TableCell>ID</TableCell>
              <TableCell>USERS</TableCell>
              <TableCell>ROLE</TableCell>
              <TableCell>EMAIL</TableCell>
            </TableRow></TableHead>
            
            <TableBody>
              {userList.map((user) => 
                <TableRow
                hover
                onClick={(event) => handleClick(event, user.id)}
                role="checkbox"
                tabIndex={-1}
                key={user.id}
                selected={selected.includes(user.id)}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.accountType}</TableCell>
                <TableCell>{user.email}</TableCell>
              </TableRow>)
              }
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

