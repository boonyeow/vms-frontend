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

export default function RegexSelect({ field, index, isNextField, fieldDataChange }) {
  const { token } = useAuthStore();
  const [regexList, setRegexList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newRegexName, setNewRegexName] = useState("");
  const [newRegexPattern, setNewRegexPattern] = useState("");

  useEffect(() => {
      fetchRegexList();

    }, []);

    const initialChosenValue =async () => {
        let initialRegex = '';
        let regexId = null;
        if (isNextField && field.options[field.name].regexId) {
            regexId = field.options[field.name].regexId;
        } else if (field.regexId) {
            regexId = field.regexId;
        }
            initialRegex = regexList.find((regex) => regex.id === regexId);
        return initialRegex;

    }
    const [chosenRegex, setChosenRegex] = useState(
      initialChosenValue() || ''
    );


  const fetchRegexList = async () => {
    await axios
      .get(process.env.REACT_APP_ENDPOINT_URL + "/api/regex", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setRegexList(res.data);
      })
      .catch((e) => console.error(e));
  };

    const handleChange = (event) => {
        setChosenRegex(event.target.value);
  };

  const handleAddNewRegex = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewRegexName("");
    setNewRegexPattern("");
    setChosenRegex("");
  };

  const handleNewRegexNameChange = (event) => {
    setNewRegexName(event.target.value);
  };

  const handleNewRegexPatternChange = (event) => {
    setNewRegexPattern(event.target.value);
  };

  const handleNewRegexSubmit = () => {
    axios
      .post(
        process.env.REACT_APP_ENDPOINT_URL + "/api/regex",
        {
          name: newRegexName,
          pattern: newRegexPattern,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        fetchRegexList();
        handleCloseDialog();
      })
      .catch((e) => console.error(e));
  };

  return (
    <div>
      <FormControl sx={{ minWidth: 120 }} size="small">
        <InputLabel id="demo-multiple-name-label">Regex</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          value={chosenRegex}
          onChange={(e) => {
            fieldDataChange(e.target.value.id, index, isNextField, "regexId");
            handleChange(e);
          }}
          input={<OutlinedInput label="Regex" />}
          MenuProps={MenuProps}
        >
          <MenuItem value="    " onClick={handleAddNewRegex}>
            Add new regex
          </MenuItem>
          <Divider />
          {regexList.length === 0 ? (
            <MenuItem value="" disabled>
              No regex available
            </MenuItem>
          ) : (
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
          )}
          {regexList.map((regex, index) => (
            <MenuItem key={regex.id} value={regex}>
              {regex.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New Regex</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={newRegexName}
            onChange={handleNewRegexNameChange}
          />
          <TextField
            margin="dense"
            label="Pattern"
            type="text"
            fullWidth
            value={newRegexPattern}
            onChange={handleNewRegexPatternChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleNewRegexSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
