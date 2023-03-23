import NavBar from "../../components/SharedComponents/NavBar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import React, { useState, useEffect } from "react";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import Menu from "@mui/material/Menu";
import EditIcon from "@mui/icons-material/Edit";
import FormControlLabel from "@mui/material/FormControlLabel";
import CloseIcon from "@mui/icons-material/Close";
import ShortTextIcon from "@mui/icons-material/ShortText";
import Grid from "@mui/material/Grid";
import Checkbox from '@mui/material/Checkbox';
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import "../../form.css";
import InputAdornment from "@mui/material/InputAdornment";
import { useAuthStore } from "../../store";
import { useNavigate } from "react-router-dom";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";

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

const FormCreation = () => {
  const names = [
    "Oliver Hansen",
    "Van Henry",
    "April Tucker",
    "Ralph Hubbard",
    "Omar Alexander",
    "Carlos Abbott",
    "Miriam Wagner",
    "Bradley Wilkerson",
    "Virginia Andrews",
    "Kelly Snyder",
  ];
  const { token } = useAuthStore();
 const url = new URL(window.location.href);
 const id = url.pathname.split("/")[2];
  const revisionNo = url.pathname.split("/")[3];
  const navigate = useNavigate();
  const [userList, setUserList] = useState([]);
  const [authorizedUserList, setAuthorizedUserList] = useState([]);

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
      console.log(res.data)
    })
    .catch((e) => console.error(e));
};
const handleChange = (event) => {
  const {
    target: { value },
  } = event;
  const newAuthorizedUserList = [...authorizedUserList];

  value.forEach((selectedOption) => {
    if (!newAuthorizedUserList.includes(selectedOption)) {
      newAuthorizedUserList.push(selectedOption);
    }
  });

  newAuthorizedUserList.forEach((existingOption, index) => {
    if (!value.includes(existingOption)) {
      newAuthorizedUserList.splice(index, 1);
    }
  });

  const newAuthorizedAccountIds = newAuthorizedUserList.map((user) => user.id);

  setAuthorizedUserList(newAuthorizedUserList);
  setFormData((prevFormData) => ({
    ...prevFormData,
    authorizedAccountIds: newAuthorizedAccountIds,
  }));
};

//   {
//   "name": "Site Evaluation Results",
//   "helpText": "laurent",
//   "isRequired": true,
//   "fieldType": "CHECKBOX",
//   "optionsWithNextFields": {
//     "Site Evaluation Results": {
//       "name": "",
//       "helpText": "",
//       "isRequired": false,
//       "fieldType": "RADIOBUTTON",
//       "optionsWithNextFields": {
//         "Satisfactory": null,
//         "Unsatisfactory": null
//       }
//     }
//   }
// }
 const nextField={
           name: "",
           helpText: "",
           isRequired: false,
           fieldType: "",
           optionsWithNextFields: {
           },
  }
    const changeData = (data, type) => {
      setFormData((prevData) => ({
        ...prevData,
        [type]: data,
      }));
    };

 const [formData, setFormData] = useState({
   name: '',
   description: null,
   isFinal: false,
   fields: [
     {
       name: "",
       helpText: "",
       isRequired: true,
       fieldType: "radio",
       optionsWithNextFields: {},
     }
   ],
   authorizedAccountIds: [],
 });
  const handleCancelForm = async () => {
 await axios
   .delete(
     process.env.REACT_APP_ENDPOINT_URL + `/api/forms/${id}/${revisionNo}`,
     {
       headers: {
         Authorization: `Bearer ${token}`,
       },
     }
   )
   .then((res) => {
     // Login successful
     navigate("/FormTemplates");
     console.log("deleted", res.data);
   })
   .catch((e) => {
     console.log(e);
   });
  }
    const [inputTypes, setInputTypes] = useState([
      { name: "Radiobutton", value: "radio" },
      { name: "CheckBox", value: "checkbox" },
      { name: "TextField", value: "text" },
      // can add more options
    ]);
  const handleChangeFieldType = (index, inputType) => {
    const newSections = [...formData.fields];
    newSections[index] = {
      ...newSections[index],
      fieldType: inputType.value,
    };
    setFormData((prevState) => ({
      ...prevState,
      fields: newSections,
    }));
  };
  const handleAddNextField = (index, input) => {
    console.log(input)
    const nextField = {
      name: "",
      helpText: "",
      isRequired: false,
      fieldType: ''
    };
    nextField.fieldType = input.value;
    if (input.value !== 'text') {
      nextField.optionsWithNextFields = {};
    }
   const newFields = [...formData.fields];
   newFields[index].optionsWithNextFields[formData.fields[index].name] = nextField;
   setFormData((prevState) => ({
     ...prevState,
     fields: newFields,
   }));
    console.log(formData)
 };
  const handleAddField = () => {
    const newField = {
      name: "",
      helpText: "",
      isRequired: true,
      fieldType: "text",
      optionsWithNextFields: {},
    };
    setFormData(prevState => ({
      ...prevState,
      fields: [...prevState.fields, newField]
    }));
  };

 const handleFieldNameChange = (value, index) => {
   const newFields = [...formData.fields];
   const prevName = newFields[index].name;

   newFields[index].name = value;

     if (newFields[index].optionsWithNextFields[prevName]) {
       newFields[index].optionsWithNextFields[value] =
         newFields[index].optionsWithNextFields[prevName];
       delete newFields[index].optionsWithNextFields[prevName];
     }

   setFormData((prevData) => ({
     ...prevData,
     fields: newFields,
   }));
 };

  const validateForm = (data) => {
    const errors = {};
    if (!data.id) errors.id = "Form ID is required.";
    if (!data.revision) errors.revision = "Revision # is required.";
    if (!data.name) errors.name = "Form Title is required.";
    return errors;
  };
    const [errors, setErrors] = useState({});

  return (
    <>
      <NavBar />
      <h1 style={{ textAlign: "center" }}>Form Creation</h1>
      <Card sx={{ maxWidth: 900, margin: "auto" }}>
        <CardContent>
          <Stack spacing={2} direction="row">
            <TextField
              label="Form ID"
              variant="standard"
              defaultValue={id}
              InputProps={{
                readOnly: true,
              }}
            />

            <TextField
              id="outlined-basic"
              label="Revision #"
              variant="standard"
              defaultValue={revisionNo}
              InputProps={{
                readOnly: true,
              }}
            />
          </Stack>
          <Stack spacing={2}>
            <TextField
              label="Form Title"
              variant="standard"
              onChange={(e) => changeData(e.target.value, "name")}
              required
              error={errors.name ? true : false}
              helperText={errors.name ? errors.name : ""}
            />

            <TextField
              id="standard-multiline-flexible"
              label="Description"
              multiline
              rows={4}
              variant="outlined"
              onChange={(e) => changeData(e.target.value, "description")}
            />
            <div>
              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-checkbox-label">
                  Authorized Accounts
                </InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={authorizedUserList}
                  onChange={handleChange}
                  input={<OutlinedInput label="AuthorizedAccounts" />}
                  renderValue={(selected) => (
                    <div>
                      {selected.map((value) => (
                        <Chip key={value.name} label={value.name} />
                      ))}
                    </div>
                  )}
                  MenuProps={MenuProps}
                >
                  {userList.map((user) => (
                    <MenuItem key={user.id} value={user}>
                      <Checkbox
                        checked={authorizedUserList.indexOf(user) > -1}
                      />
                      <ListItemText primary={user.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </Stack>
          <Card sx={{ maxWidth: 900, margin: "auto", marginTop: 2 }}>
            <CardContent>
              <Stack spacing={2} direction="row" justifyContent="space-between">
                <Button variant="text" color="primary" onClick={handleAddField}>
                  Add Field
                </Button>
              </Stack>
              {formData.fields.map((field, index) => (
                <>
                  <Grid
                    container
                    justifyContent="flex-start"
                    alignItems="center"
                    key={index}
                  >
                    <Grid item xs={1}>
                      <Box sx={{ flexGrow: 0 }}>
                        <PopupState variant="popover" popupId="demo-popup-menu">
                          {(popupState) => (
                            <React.Fragment>
                              <IconButton {...bindTrigger(popupState)}>
                                <EditIcon />
                              </IconButton>

                              <Menu {...bindMenu(popupState)}>
                                {inputTypes.map((input, k) => (
                                  <MenuItem
                                    onClick={() => {
                                      popupState.close();
                                      handleChangeFieldType(index, input);
                                    }}
                                    key={`${k}`}
                                  >
                                    <Typography textAlign="center">
                                      {input.name}
                                    </Typography>
                                  </MenuItem>
                                ))}
                              </Menu>
                            </React.Fragment>
                          )}
                        </PopupState>
                      </Box>
                    </Grid>
                    {field.fieldType === "text" ? (
                      <Grid item xs={3}>
                        <div>
                          <input type={field.fieldType} key={index} />
                          {/* render additional input fields based on field type */}
                        </div>
                      </Grid>
                    ) : (
                      <Grid item xs={1}>
                        <div>
                          <input type={field.fieldType} key={index} />
                          {/* render additional input fields based on field type */}
                        </div>
                      </Grid>
                    )}
                    <Grid item xs={4}>
                      <input
                        type="text"
                        placeholder=""
                        className="option-text"
                        value={field.name}
                        onChange={(e) =>
                          handleFieldNameChange(e.target.value, index)
                        }
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <Tooltip title="Add Field Beside">
                        <Box sx={{ flexGrow: 0 }}>
                          <PopupState
                            variant="popover"
                            popupId="demo-popup-menu"
                          >
                            {(popupState) => (
                              <React.Fragment>
                                <IconButton
                                  aria-label="add"
                                  {...bindTrigger(popupState)}
                                >
                                  <AddIcon />
                                </IconButton>

                                <Menu {...bindMenu(popupState)}>
                                  {inputTypes.map((input, k) => (
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close();
                                        handleAddNextField(index, input);
                                      }}
                                      key={`${k}`}
                                    >
                                      <Typography textAlign="center">
                                        {input.name}
                                      </Typography>
                                    </MenuItem>
                                  ))}
                                </Menu>
                              </React.Fragment>
                            )}
                          </PopupState>
                        </Box>
                      </Tooltip>
                    </Grid>
                    {Object.keys(field.optionsWithNextFields).length !== 0 ? (
                      <Grid>
                        <input
                          type={
                            field.optionsWithNextFields[field.name].fieldType
                          }
                        />
                      </Grid>
                    ) : (
                      ""
                    )}
                  </Grid>
                </>
              ))}
            </CardContent>
          </Card>
        </CardContent>
        <CardActions>
          {/* <Button size="small" onClick={handleAddSection}>
            Add Section
          </Button> */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "85%",
              gap: 10,
            }}
          >
            <Button
              size="small"
              variant="contained"
              style={{ backgroundColor: "orange" }}
            >
              Save as Draft
            </Button>
            <Button
              size="small"
              variant="contained"
              style={{ backgroundColor: "grey" }}
              onClick={handleCancelForm}
            >
              Cancel
            </Button>
            <Button size="small" variant="contained" color="primary">
              Done
            </Button>
          </div>
        </CardActions>
      </Card>

      {/* <Button variant="contained">Add RadioButtons</Button>
      <RadioButtonInput /> */}
    </>
  );
};
export default FormCreation;
