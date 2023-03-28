import React, { useState, useEffect } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import axios from "axios";
import _ from "lodash";
import { useAuthStore } from "../../store";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function EditAuthorizedAccounts({
  handleCloseDialog,
  authorizedUserList,
    handleChange,
    openDialog,
    setOpenDialog,
    target,
    type
}) {
    const { token } = useAuthStore();
    const [userList, setUserList] = useState([])
    const [oldAuthorizedAccounts, setOldAuthorizedAccounts] =useState( []);
  useEffect(() => {
    fetchUserList();
  }, []);
    useEffect(() => {
      if (openDialog && type==='workflow') {
        setOldAuthorizedAccounts(_.cloneDeep(authorizedUserList));
      }
    }, [openDialog]);

    const handleNewAuthorizedUsers = async () => {
        if (type === 'form') {
            await axios
              .put(
                process.env.REACT_APP_ENDPOINT_URL +
                  `/api/forms/${target.id}/${target.revisionNo}/authorizedAccount`,
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
        } else {
            // console.log(authorizedUserList);
            // console.log(oldAuthorizedAccounts);
            setOldAuthorizedAccounts([])
            const oldList = [...oldAuthorizedAccounts];
            const newList = [...authorizedUserList];

            const deleted = oldList.filter((x) => !newList.includes(x));
            const added = newList.filter((x) => !oldList.includes(x));

                added?.map(async (user) => {
                    await axios
                      .post(
                        process.env.REACT_APP_ENDPOINT_URL +
                          `/api/workflows/${target}/authorizedAccount?accountId=${user}`,
                        authorizedUserList,
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      )
                      .then((res) => {})
                      .catch((e) => console.error(e));
                        })


                deleted?.map(async (user) => {
                    await axios
                    .delete(
                        process.env.REACT_APP_ENDPOINT_URL +
                        `/api/workflows/${target}/authorizedAccount?accountId=${user}`,
                        {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        }
                    )
                    .then((res) => {})
                    .catch((e) => console.error(e));
                });

                setOpenDialog(false);
    }
};
  const fetchUserList = async () => {
    await axios
      .get(process.env.REACT_APP_ENDPOINT_URL + "/api/accounts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
          setUserList(res.data);
          //console.log(res.data)
      })
          .catch((e) => console.error(e));
  };


  return (
    <Dialog fullWidth open={openDialog}>
      <DialogTitle>Edit Authorized Accounts</DialogTitle>
      <DialogContent>
        <Select
          fullWidth
          value={authorizedUserList}
          onChange={handleChange}
          multiple
        >
          {userList.map((user) => (
              <MenuItem key={user.id} value={type === 'form' ? user.email : user.id}>
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
  );
}

