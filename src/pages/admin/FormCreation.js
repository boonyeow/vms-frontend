import NavBar from "../../components/SharedComponents/NavBar";
import NextFields from "../../components/FormInputs/NextFields";
import RegexSelect from "../../components/FormInputs/RegexSelect";
import FieldTypeMenu from "../../components/FormInputs/FieldTypeMenu";
import RequiredCheckBox from "../../components/FormInputs/RequiredCheckBox";
import { useBeforeUnload, useParams } from "react-router-dom";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  FormLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  IconButton,
  Typography,
  Stack,
  MenuItem,
  Grid,
  Checkbox,
  Tooltip,
  Alert,
  Box,
  OutlinedInput,
  InputLabel,
  FormControl,
  ListItemText,
  Chip,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Snackbar,
} from "@mui/material";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import "../../form.css";
import { useAuthStore } from "../../store";
import { useNavigate } from "react-router-dom";
import Select from "@mui/material/Select";
import _ from "lodash";

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

const fieldTypeMatching = {
  text: "TEXTBOX",
  radio: "RADIOBUTTON",
  checkbox: "CHECKBOX",
  TEXTBOX: "text",
  RADIOBUTTON: "radio",
  CHECKBOX: "checkbox",
};

const FormCreation = () => {
  const { token } = useAuthStore();
  const { id, revisionNo } = useParams();
  const navigate = useNavigate();

  const [isDisabled, setIsDisabled] = useState(false);
  const [open, setOpen] = useState(false);
  const nextFieldTemplate = {
    name: null,
    fieldType: null,
    options: [{ name: "" }],
    helpText: null,
    regexId: null,
    isRequired: false,
  };

  const childOptionTemplate = { name:'' }

  const parentFieldTemplate = {
    name: '',
    options: [],
  };
  const [formData, setFormData] = useState({
    name: "",
    description: null,
    is_final: false,
    workflows: [],
    fields: [
      {
        name: "",
        helpText: "",
        isRequired: true,
        fieldType: "RADIOBUTTON",
        regexId: null,
        options: [
          {
            name: null,
            options: [],
          },
        ],
      },
    ],
  });
  useEffect(() => {
    //getFormData();
  }, []);
  const addChildOption = (index, j, k) => {
    const newFields = [...formData.fields];
    if (newFields[index].options[j].options[k].options.length > 5) {
      return
    }
      newFields[index].options[j].options[k].options.push(parentFieldTemplate);
     setFormData((prevState) => ({
       ...prevState,
       fields: newFields,
     }));

}
  useBeforeUnload(
    useCallback(() => {
      localStorage.setItem(`formCreation${id}${revisionNo}`, formData);
    }, [])
  );

  const addOption = (index) => {
    const newFields = [...formData.fields]
    console.log(newFields)
    if (newFields[index].options.length > 10) {
      return;
    }
    newFields[index].options.push(parentFieldTemplate);
    setFormData((prevState) => ({
      ...prevState,
      fields: newFields,
    }));

  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const getFormData = async () => {
    const savedFormData = localStorage.getItem(
      `formCreation${id}${revisionNo}`
    );
    console.log(savedFormData);
    let data = {
      name: "",
      description: null,
      is_final: false,
      workflows: [],
      fields: [
        {
          name: "",
          helpText: "",
          isRequired: true,
          fieldType: "RADIOBUTTON",
          regexId: null,
          nextFieldsId: {},
        },
      ],
    };
    await axios
      .get(
        process.env.REACT_APP_ENDPOINT_URL + `/api/forms/${id}/${revisionNo}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(async (res) => {
        // console.log(res.data)
        data = { ...data, ...res.data };
        // setFormTitle("Create Form");
        setIsDisabled(data.is_final);
        const fieldtoDelete = [];
        await axios
          .get(
            process.env.REACT_APP_ENDPOINT_URL +
              `/api/forms/${id}/${revisionNo}/fields`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then(async (res) => {
            console.log(res.data);
            data.fields = res.data;
            // setFormTitle("Edit Form")
            const promises = [];
            res.data.forEach((field, index) => {
              if (field.nextFieldsId) {
                for (const [key, value] of Object.entries(field.nextFieldsId)) {
                  promises.push(
                    axios
                      .get(
                        process.env.REACT_APP_ENDPOINT_URL +
                          `/api/fields/dto/${value}`,
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      )
                      .then((res) => {
                        data.fields[index].nextFieldsId[key] = res.data;
                        //console.log(value)
                        fieldtoDelete.push(value);
                      })
                      .catch((e) => console.error(e))
                  );
                }
              }
            });
            // Wait for all axios calls to finish
            await Promise.all(promises);
          })
          .catch((e) => console.error(e));
        data.fields = data.fields.filter(
          (obj) => !fieldtoDelete.includes(obj.id)
        );
        let form = await replaceKey(data);
        let processedForm = await processForm(form);
        //console.log(replaceKey(processedForm));
        console.log(processedForm);
        setFormData(processedForm);
      })

      .catch((e) => console.error(e));
  };

  const replaceKey = (obj) => {
    // console.log(obj)
    let converedObj = _.cloneDeep(obj);
    converedObj.fields.map((field) => {
      if (field.nextFieldsId) {
        let data = field.nextFieldsId;
        field.options = data;
        delete field.nextFieldsId;
        if (Object.keys(field.options).length > 0) {
          for (const [key, value] of Object.entries(field.options)) {
            if (value?.nextFieldsId) {
              let nesteddata = value.nextFieldsId;
              field.options[key].options = nesteddata;
              delete field.options[key].nextFieldsId;
            }
          }
        }
      }
    });
    return converedObj;
  };

  const processForm = (form) => {
    let newForm = _.cloneDeep(form);
    newForm.fields.map((field) => {
      // Check if fieldType exists and set it to null
      if (field.fieldType) {
        field.fieldType = fieldTypeMatching[field.fieldType];
      }
      // Check if options exists and recursively set its fieldType to null
      if (field.options) {
        Object.values(field.options).forEach((nestedField) => {
          if (nestedField?.fieldType) {
            //console.log( nestedField.fieldType)
            nestedField.fieldType = fieldTypeMatching[nestedField.fieldType];
          }
        });
      }
    });
    return newForm;
  };

  const handleSubmitForm = async () => {
    let processedForm = await processForm(formData);
    delete processedForm.id;

    processedForm.fields.map((field) => {
      delete field.id;
      if (field.regexId === null) {
        delete field.regexId;
      }

      if (field.options) {
        for (const [key, value] of Object.entries(field.options)) {
          delete field.options[key].id;
          if (field.options[key].regexId === null) {
            delete field.options[key].regexId;
          }
        }
      }
      return field;
    });

    await axios
      .put(
        process.env.REACT_APP_ENDPOINT_URL + `/api/forms/${id}/${revisionNo}`,
        processedForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .catch((e) => {
        console.log(e);
      });
  };


  const nextFieldOptionChange = (value, key, index) => {
    const newFields = [...formData.fields];
    const object = newFields[index].options[newFields[index].name];
    object.options[value] = object.options[key];
    delete object.options[key];

    setFormData((prevData) => ({
      ...prevData,
      fields: newFields,
    }));
  };

  const changeData = (data, type) => {
    // if (type == 'isFinal') {
    //  setIsDisabled(data);
    // }
    setFormData((prevData) => ({
      ...prevData,
      [type]: data,
    }));
    //  console.log(formData);
  };

  const fieldDataChange = (value, index, isNextField, type) => {
    const newFields = [...formData.fields];
    if (isNextField) {
      newFields[index].options[newFields[index].name][type] = value;
    } else {
      newFields[index][type] = value;
    }
    setFormData((prevState) => ({
      ...prevState,
      fields: newFields,
    }));
  };
  const deleteField = (index) => {
    const newFields = [...formData.fields];
    newFields.splice(index, 1);
    setFormData((prevState) => ({
      ...prevState,
      fields: newFields,
    }));
  };

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
  };

  const handleChangeFieldType = (index, input, isNextField,j) => {
    const newFields = [...formData.fields];
    console.log(newFields)
    if (isNextField) {
      const nextField = _.cloneDeep(nextFieldTemplate);
      nextField.fieldType = input.value;
      if (newFields[index]?.options[j]?.options?.length > 0) {
        console.log(newFields[index].options[j].options);
        newFields[index].options[j].options[0].fieldType = input.value;
      } else {
        newFields[index].options[j].options.push(nextField);
      }
    } else {
      newFields[index] = {
        ...newFields[index],
        fieldType: input.value,
      };
    }
    console.log(newFields)
    setFormData((prevState) => ({
      ...prevState,
      fields: newFields,
    }));
  };

  const handleAddField = () => {

    setFormData((prevState) => ({
      ...prevState,
      fields: [...prevState.fields, nextFieldTemplate],
    }));
  };

  const addNextFieldOptions = (index) => {
    const newFields = [...formData.fields];
    const length = Object.keys(
      newFields[index].options[newFields[index].name].options
    ).length;
    newFields[index].options[newFields[index].name].options[
      `option${length + 1}`
    ] = null;
    setFormData((prevData) => ({
      ...prevData,
      fields: newFields,
    }));
    // console.log(newFields);
  };
  const handleFieldNameChange = (value, index) => {
    //console.log(formData);
    const newFields = [...formData.fields];
    const prevName = newFields[index].name;
    //console.log(formData.fields);
    newFields[index].name = value;

    if (newFields[index].options && newFields[index].options[prevName]) {
      newFields[index].options[value] = newFields[index].options[prevName];
      delete newFields[index].options[prevName];
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
  const [formTitle, setFormTitle] = useState("");
  const deleteNextFieldOptions = (index, key, isText) => {
    const newFields = [...formData.fields];
    if (!isText) {
      delete newFields[index].options[newFields[index].name].options[key];
    }
    if (
      isText ||
      Object.keys(newFields[index].options[newFields[index].name].options)
        .length === 0
    ) {
      newFields[index].options = {};
    }
    setFormData((prevData) => ({
      ...prevData,
      fields: newFields,
    }));
  };
  if (!formData) {
    return <div>Loading...</div>;
  }

  const isFinalAlertComponent = () => {
    if (isDisabled) {
      return (
        <Alert severity="warning" sx={{ width: "100%" }}>
          Form is final and submission is disabled. Please duplicate this form
          if further upates are necessary.
        </Alert>
      );
    }
  };
  return (
    <>
      <NavBar />
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Form submitted successfully!
        </Alert>
      </Snackbar>
      <h1 style={{ textAlign: "center" }}>{formTitle}</h1>
      <Card sx={{ maxWidth: 1000, margin: "auto" }}>
        {isFinalAlertComponent()}
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
              defaultValue={formData.name}
              variant="standard"
              onChange={(e) => changeData(e.target.value, "name")}
              required
              error={errors.name ? true : false}
              helperText={errors.name ? errors.name : ""}
            />

            <TextField
              id="standard-multiline-flexible"
              label="Description"
              defaultValue={formData.description}
              multiline
              rows={4}
              variant="outlined"
              onChange={(e) => changeData(e.target.value, "description")}
            />
          </Stack>
          <Card sx={{ maxWidth: 1100, margin: "auto", marginTop: 2 }}>
            <CardContent>
              {formData?.fields?.map((field, index) => (
                <>
                  <FieldTypeMenu
                    handleChangeFieldType={handleChangeFieldType}
                    index={index}
                    isNextField={false}
                  />
                  <Stack direction="row">
                    <Stack spacing={4} alignItems="flex-start">
                      <TextField
                        label="Label"
                        variant="standard"
                        sx={{ width: "250px" }}
                        onChange={(e) => {
                          const newFields = [...formData.fields];
                          newFields[index].name = e.target.value;
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
                        defaultValue={field.helpText}
                        inputProps={{ style: { fontSize: 12 } }}
                        InputLabelProps={{ style: { fontSize: 12 } }}
                        label="Help Text (optional)"
                        onChange={(e) => {
                          const newFields = [...formData.fields];
                          newFields[index].helpText = e.target.value;
                          setFormData((prevState) => ({
                            ...prevState,
                            fields: newFields,
                          }));
                        }}
                      />
                      {field?.options?.map((option, j) => (
                        <Stack
                          direction="row"
                          justifyContent="flex-start"
                          alignItems="center"
                        >
                          {field.fieldType == "RADIOBUTTON" && (
                            <input type="radio" name={index} />
                          )}
                          {field.fieldType === "CHECKBOX" && (
                            <input type="checkbox" name={`${index}-${j}`} />
                          )}
                          {field.fieldType === "TEXTBOX" && (
                            <TextField variant="outlined" size="small" />
                          )}
                          {field.fieldType !== "TEXTBOX" && (
                            <Stack direction="row" spacing={5}>
                              <TextField
                                variant="standard"
                                value={option.name}
                                onChange={(e) => {
                                  const newFields = [...formData.fields];
                                  newFields[index].options[j].name =
                                    e.target.value;
                                  setFormData((prevState) => ({
                                    ...prevState,
                                    fields: newFields,
                                  }));
                                }}
                              />
                              <FieldTypeMenu
                                handleChangeFieldType={handleChangeFieldType}
                                index={index}
                                isNextField={true}
                                j={j}
                              />
                            </Stack>
                          )}
                          {j > 0 && (
                            <IconButton
                              onClick={() => {
                                const newFields = [...formData.fields];
                                newFields[index].options.splice(j, 1);
                                setFormData((prevState) => ({
                                  ...prevState,
                                  fields: newFields,
                                }));
                              }}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          )}
                          {option?.options?.map((childField, k) => (
                            <Stack sx={{ marginLeft: "70px" }}>
                              <TextField
                                label="Label"
                                variant="standard"
                                sx={{ width: "250px" }}
                                value={childField.name}
                                onChange={(e) => {
                                  const newFields = [...formData.fields];
                                  newFields[index].options[j].name =
                                    e.target.value;
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
                                defaultValue={childField.helpText}
                                inputProps={{ style: { fontSize: 12 } }}
                                InputLabelProps={{
                                  style: { fontSize: 12 },
                                }}
                                label="Help Text (optional)"
                                onChange={(e) => {
                                  const newFields = [...formData.fields];
                                  newFields[index].options[j].options[
                                    k
                                  ].helpText = e.target.value;
                                  setFormData((prevState) => ({
                                    ...prevState,
                                    fields: newFields,
                                  }));
                                }}
                              />
                              {childField?.options?.map((childOption, n) => (
                                <Stack
                                  direction="row"
                                  justifyContent="flex-start"
                                  alignItems="center"
                                >
                                  {childField.fieldType == "RADIOBUTTON" && (
                                    <input type="radio" name={n} />
                                  )}
                                  {childField.fieldType === "CHECKBOX" && (
                                    <input type="checkbox" name={`${n}-${k}`} />
                                  )}
                                  {childField.fieldType === "TEXTBOX" && (
                                    <TextField
                                      variant="outlined"
                                      size="small"
                                    />
                                  )}
                                  {childField.fieldType !== "TEXTBOX" && (
                                    <Stack direction="row" spacing={5}>
                                      <TextField
                                        variant="standard"
                                        value={childOption.name}
                                        onChange={(e) => {
                                          const newFields = [
                                            ...formData.fields,
                                          ];
                                          newFields[index].options[j].options[
                                            k
                                          ].options[n].name = e.target.value;
                                          setFormData((prevState) => ({
                                            ...prevState,
                                            fields: newFields,
                                          }));
                                        }}
                                      />
                                    </Stack>
                                  )}

                                  <IconButton
                                    onClick={() => {
                                      const newFields = [...formData.fields];
                                      if (n == 0) {
                                        console.log(
                                          newFields[index].options[j]
                                        );
                                        newFields[index].options[j].options= [];
                                      } else {
                                        newFields[index].options[j].options[
                                          k
                                        ].options.splice(n, 1);
                                      }
                                      setFormData((prevState) => ({
                                        ...prevState,
                                        fields: newFields,
                                      }));
                                    }}
                                  >
                                    <CloseIcon fontSize="small" />
                                  </IconButton>
                                </Stack>
                              ))}
                              {childField.fieldType != "TEXTBOX" && (
                                <Button
                                  color="secondary"
                                  onClick={() => addChildOption(index, j, k)}
                                >
                                  Add option
                                </Button>
                              )}
                            </Stack>
                          ))}
                        </Stack>
                      ))}
                      {field.fieldType != "TEXTBOX" && (
                        <Button
                          color="secondary"
                          onClick={() => addOption(index)}
                        >
                          Add option
                        </Button>
                      )}
                    </Stack>
                  </Stack>

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
            <Tooltip
              title="Once form is final, updating will create new revision."
              placement="top-start"
            >
              <ToggleButtonGroup
                color="primary"
                exclusive
                value={formData.is_final}
                onChange={(e) =>
                  changeData(e.target.value === "true", "is_final")
                }
                aria-label="Platform"
              >
                <ToggleButton value={true}>Final</ToggleButton>
                <ToggleButton value={false} disabled={isDisabled}>
                  Not Final
                </ToggleButton>
              </ToggleButtonGroup>
            </Tooltip>
            <Button
              size="small"
              variant="contained"
              style={{ backgroundColor: "red" }}
              onClick={handleCancelForm}
            >
              Delete
            </Button>

            <Button
              size="small"
              variant="contained"
              style={{ backgroundColor: "grey" }}
              onClick={() => {
                navigate("../../../FormTemplates");
              }}
            >
              Cancel
            </Button>

            <Button
              size="small"
              variant="contained"
              color="primary"
              disabled={isDisabled}
              onClick={(e) => handleSubmitForm()}
            >
              Submit
            </Button>
          </div>
        </CardActions>
      </Card>
    </>
  );
};


export default FormCreation;
