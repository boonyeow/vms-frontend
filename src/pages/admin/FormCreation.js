import NavBar from "../../components/SharedComponents/NavBar";
import NextFields from "../../components/FormInputs/NextFields"
import RegexSelect from "../../components/FormInputs/RegexSelect";
import FieldTypeMenu from "../../components/FormInputs/FieldTypeMenu";
import RequiredCheckBox from "../../components/FormInputs/RequiredCheckBox";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  IconButton,
  Stack,
  MenuItem,
  Grid,
  Checkbox,
  Tooltip,
  OutlinedInput,
  InputLabel,
  FormControl,
  ListItemText,
  Chip,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";

import DeleteIcon from "@mui/icons-material/Delete";
import "../../form.css";
import { useAuthStore } from "../../store";
import { useNavigate } from "react-router-dom";
import Select from "@mui/material/Select";


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

  const handleSubmitForm = async () => {
    console.log(formData);
    await axios
   .put(
     process.env.REACT_APP_ENDPOINT_URL + `/api/forms/${id}/${revisionNo}`, {formData},
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
  };

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

  const nextFieldOptionChange = (value, key, index) => {
    const newFields = [...formData.fields];
    const object =
      newFields[index].optionsWithNextFields[newFields[index].name];
      object.optionsWithNextFields[value] = object.optionsWithNextFields[key];
      delete object.optionsWithNextFields[key];

        setFormData((prevData) => ({
         ...prevData,
         fields: newFields,
       }));
}

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

  const changeData = (data, type) => {
      console.log(data)
      setFormData((prevData) => ({
        ...prevData,
        [type]: data,
      }));
      console.log(formData)
  };

  const fieldDataChange = (value, index, isNextField, type)=>{
      const newFields = [...formData.fields];
      if (isNextField) {
        newFields[index].optionsWithNextFields[newFields[index].name][type] =
          value;
      } else {
        newFields[index][type]  = value;
      }
      console.log(newFields)
      setFormData((prevState) => ({
        ...prevState,
        fields: newFields,
      }));
  }
  const deleteField = (index) => {
    const newFields = [...formData.fields];
    newFields.splice(index,1)
    console.log(newFields)
    setFormData((prevState) => ({
      ...prevState,
      fields: newFields,
    }));
  }

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
       regexId:null
      //  optionsWithNextFields: {},
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

  const handleChangeFieldType = (index, input, isNextField) => {
    const newFields = [...formData.fields];
    if (isNextField) {
      if (!newFields[index].optionsWithNextFields) {
        newFields[index].optionsWithNextFields={};
      }
      const nextField = {
        name: "",
        helpText: "",
        isRequired: false,
        fieldType: "",
        regexId: null,
      };
      nextField.fieldType = input.value;
      if (input.value !== "text") {
        nextField.optionsWithNextFields = { option1: null };
      }
      newFields[index].optionsWithNextFields[formData.fields[index].name] =
        nextField;
    } else {
      newFields[index] = {
        ...newFields[index],
        fieldType: input.value,
      };
    }
    setFormData((prevState) => ({
      ...prevState,
      fields: newFields,
    }));
  };

  const handleAddField = () => {
    const newField = {
      name: "",
      helpText: "",
      isRequired: true,
      fieldType: "text",

    };
    setFormData(prevState => ({
      ...prevState,
      fields: [...prevState.fields, newField]
    }));
  };

  const addNextFieldOptions = (index) => {
    const newFields = [...formData.fields];
     const length = Object.keys(
       newFields[index].optionsWithNextFields[newFields[index].name]
         .optionsWithNextFields
     ).length;
    newFields[index].optionsWithNextFields[
      newFields[index].name
    ].optionsWithNextFields[`option${length+1}`] = null;
    setFormData((prevData) => ({
      ...prevData,
      fields: newFields,
    }));
    console.log(newFields)
  };
  const handleFieldNameChange = (value, index) => {
   console.log(formData)
   const newFields = [...formData.fields];
   const prevName = newFields[index].name;
    console.log(formData.fields)
   newFields[index].name = value;

     if (
       newFields[index].optionsWithNextFields && newFields[index]
         .optionsWithNextFields[prevName]
     ) {
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
    if (!data.name) errors.name = "Form Name is required.";
    return errors;
  };
  const [errors, setErrors] = useState({});

  const deleteNextFieldOptions = (index, key, isText) => {

    const newFields = [...formData.fields];
    if (!isText) {

      delete newFields[index].optionsWithNextFields[newFields[index].name].optionsWithNextFields[key];
    }
    if (
       isText ||
      Object.keys(
        newFields[index].optionsWithNextFields[newFields[index].name]
          .optionsWithNextFields
      ).length === 0
    ) {
      newFields[index].optionsWithNextFields = {};
    }
      setFormData((prevData) => ({
        ...prevData,
        fields: newFields,
      }));
}
  return (
    <>
      <NavBar />
      <h1 style={{ textAlign: "center" }}>Form Creation</h1>
      <Card sx={{ maxWidth: 1100, margin: "auto" }}>
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
              label="Form Name"
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
          <Card sx={{ maxWidth: 1100, margin: "auto", marginTop: 2 }}>
            <CardContent>
              {formData.fields.map((field, index) => (
                <>
                  <Grid
                    container
                    justifyContent="flex-start"
                    alignItems="center"
                    key={index}
                  >
                    <Grid item xs={5}>
                      <Stack>
                        <Stack
                          direction="row"
                          spacing={3}
                          justifyContent="flex-start"
                          alignItems="center"
                        >
                          <FieldTypeMenu
                            handleChangeFieldType={handleChangeFieldType}
                            index={index}
                            isNextField={false}
                          />

                          {field.fieldType === "text" ? (
                            ""
                          ) : (
                            <div>
                              <input
                                type={field.fieldType}
                                key={index}
                                name={
                                  field.fieldType === "radio"
                                    ? "radioGroup"
                                    : field.name
                                }
                              />
                            </div>
                          )}

                          <input
                            type="text"
                            placeholder=""
                            className="option-text"
                            value={field.name}
                            onChange={(e) =>
                              handleFieldNameChange(e.target.value, index)
                            }
                          />
                        </Stack>
                        {field.fieldType !== "text" ? (
                          ""
                        ) : (
                          <Stack>
                            <TextField
                              fullWidth
                              variant="outlined"
                              key={index}
                              size="small"
                              sx={{
                                marginTop: 2,
                                paddingX: 3,
                                maxWidth: "70%",
                              }}
                              placeholder="User Input"
                            />
                          </Stack>
                        )}
                        <Stack
                          justifyContent="flex-start"
                          alignItems="flex-end"
                          direction="row"
                          spacing={2}
                          sx={{ marginLeft: 8 }}
                        >
                          <TextField
                            size="small"
                            variant="standard"
                            sx={{ marginTop: 2 }}
                            inputProps={{ style: { fontSize: 12 } }}
                            InputLabelProps={{ style: { fontSize: 12 } }}
                            label="Help Text (optional)"
                            onBlur={(e) =>
                              fieldDataChange(
                                e.target.value,
                                index,
                                false,
                                "helpText"
                              )
                            }
                          />
                        </Stack>

                        <Stack
                          direction="row"
                          spacing={3}
                          justifyContent="flex-start"
                          alignItems="center"
                          sx={{ marginTop: 3, marginLeft: 8 }}
                        >
                          <RequiredCheckBox
                            fields={field}
                            nextField={false}
                            index={index}
                            fieldDataChange={fieldDataChange}
                          />
                          <RegexSelect
                            index={index}
                            isNextField={false}
                            fieldDataChange={fieldDataChange}
                          />
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid item xs={1}>
                      <Tooltip title="Add Field Beside">
                        <div>
                          <FieldTypeMenu
                            handleChangeFieldType={handleChangeFieldType}
                            index={index}
                            isNextField={true}
                          />
                        </div>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={6}>
                      {field.optionsWithNextFields &&
                      Object.keys(field.optionsWithNextFields).length !== 0 ? (
                        <>
                          <Stack spacing={2}>
                            <TextField
                              id="outlined-basic"
                              label="Name"
                              variant="standard"
                              onChange={(e) => {
                                const newFields = [...formData.fields];
                                newFields[index].optionsWithNextFields[
                                  newFields[index].name
                                ].name = e.target.value;
                                setFormData((prevState) => ({
                                  ...prevState,
                                  fields: newFields,
                                }));
                              }}
                            />
                            <TextField
                              size="small"
                              variant="standard"
                              sx={{
                                marginTop: 2,
                                maxWidth: "50%",
                              }}
                              inputProps={{ style: { fontSize: 12 } }}
                              InputLabelProps={{ style: { fontSize: 12 } }}
                              label="Help Text (optional)"
                              onBlur={(e) =>
                                fieldDataChange(
                                  e.target.value,
                                  index,
                                  false,
                                  "helpText"
                                )
                              }
                            />
                            <NextFields
                              field={field}
                              index={index}
                              nextFieldOptionChange={nextFieldOptionChange}
                              addNextFieldOptions={addNextFieldOptions}
                              deleteNextFieldOptions={deleteNextFieldOptions}
                            />
                          </Stack>
                          <Grid
                            item
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <RequiredCheckBox
                              fields={field.optionsWithNextFields[field.name]}
                              nextField={true}
                              index={index}
                              fieldDataChange={fieldDataChange}
                            />
                            {field.optionsWithNextFields[field.name]
                              .fieldType === "text" ? (
                              <RegexSelect
                                index={index}
                                isNextField={true}
                                fieldDataChange={fieldDataChange}
                              />
                            ) : (
                              ""
                            )}
                          </Grid>
                        </>
                      ) : (
                        ""
                      )}
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="flex-end"
                  >
                    {index !== 0 ? (
                      <IconButton onClick={() => deleteField(index)}>
                        <DeleteIcon />
                      </IconButton>
                    ) : (
                      ""
                    )}
                  </Grid>
                  <Divider sx={{ marginY: 3 }} />
                </>
              ))}
              <Stack spacing={2} direction="row" justifyContent="space-between">
                <Button variant="text" color="primary" onClick={handleAddField}>
                  Add Field
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </CardContent>
        <CardActions>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "85%",
              gap: 10,
            }}
          >
            <ToggleButtonGroup
              color="primary"
              exclusive
              value={formData.isFinal}
              onChange={(e) => changeData(e.target.value,'isFinal')}
              aria-label="Platform"
            >
              <ToggleButton value={true} >Final</ToggleButton>
              <ToggleButton value={false}>Not Final</ToggleButton>
            </ToggleButtonGroup>
            <Button
              size="small"
              variant="contained"
              style={{ backgroundColor: "grey" }}
              onClick={handleCancelForm}
            >
              Cancel
            </Button>

            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={(e) => handleSubmitForm()}
            >
              Done
            </Button>
          </div>
        </CardActions>
      </Card>
    </>
  );
};
export default FormCreation;
