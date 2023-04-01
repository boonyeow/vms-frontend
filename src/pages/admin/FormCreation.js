import NavBar from "../../components/SharedComponents/NavBar";
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
  IconButton,
  Stack,
  Grid,
  Tooltip,
  Alert,
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
import _ from "lodash";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const FormCreation = () => {
  const { token } = useAuthStore();
  const { id, revisionNo } = useParams();
  const navigate = useNavigate();

  const [isDisabled, setIsDisabled] = useState(false);
  const [open, setOpen] = useState(false);
  const nextFieldTemplate = {
    name: '',
    fieldType: 'RADIOBUTTON',
    options: [{ name: "", options: [] }],
    helpText: '',
    regexId: '',
    isRequired: false,
  };

  const childOptionTemplate = { name:'' }

  const parentFieldTemplate = {
    name: '',
    options: [],
  };
  const [formData, setFormData] = useState({
    name: "",
    description: '',
    is_final: false,
    workflows: [],
    fields: [
      {
        name: "",
        helpText: "",
        isRequired: true,
        fieldType: "RADIOBUTTON",
        regexId: '',
        options: [
          {
            name: '',
            options: [],
          },
        ],
      },
    ],
  });
  useEffect(() => {
    getFormData();
  }, []);
  const addChildOption = (index, j, k) => {
    const newFields = [...formData.fields];
    if (newFields[index].options[j].options[k].options.length > 5) {
      return
    }
      newFields[index].options[j].options[k].options.push(childOptionTemplate);
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
    if (newFields[index].options.length > 10) {
      return;
    }
    newFields[index].options.push(parentFieldTemplate);
    setFormData((prevState) => ({
      ...prevState,
      fields: newFields,
    }));

  }
  const [snackbarAlertInfo,setSnackbarAlertInfo] = useState('')
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const getFormData = async () => {

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
          regexId: '',
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
            data.fields = res.data;
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
            await Promise.all(promises);
          })
          .catch((e) => console.error(e));
        data.fields = data.fields.filter(
          (obj) => !fieldtoDelete.includes(obj.id)
        );
        let form = await replaceKey(data);
        form.fields.map((field) => {
          if (field?.id) {
            delete field.id
            if (field.options) {
              for (const [key, value] of Object.entries(field.options)) {
                if (value) {
                  delete value.id
               }
              }
            }
          }
          return field
        })
         form.fields.map((field) => {
           if (!field.options) {
             field["options"] = [{ name: "", options: [] }];
             return;
           }
           let test = [];
           for (const [key, value] of Object.entries(field.options)) {
             let newOptions = [];
             if (value?.options) {
               for (const [k, v] of Object.entries(value.options)) {
                 newOptions.push({ name: k });
                }
             } else {
               newOptions.push({ name: '' });
              }
             if (value) {
               test.push({ name: key, options: [{ ...value, options:newOptions}], });
             } else {
               test.push({ name: key })
              }
               field.options = test;
           }
           return field;
         });
        setFormData(form);
      })
      .catch((e) => console.error(e));
  };

  const replaceKey = (obj) => {
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


  const handleSubmitForm = async () => {
    let form = _.cloneDeep(formData);
    if (form.id) {
      delete form.id
    }
     form.fields.map((field) => {
       let newOptions = {};
       field?.options?.map((option) => {
         let childOp = {};
         if (option.options && option?.options?.length !== 0) {
           newOptions[option.name] = option.options[0];
           option.options[0]?.options?.map((op) => {
             childOp[op.name] = null;
           });
           newOptions[option.name].options = childOp;

         } else {
           newOptions[option.name] = null;
         }
       });
       if (Object.keys(newOptions).length > 0) {
         field.options = newOptions;
       } else {
         delete field.options;
       }
       return field;
     });
      await axios
        .put(
          process.env.REACT_APP_ENDPOINT_URL + `/api/forms/${id}/${revisionNo}`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
      ).then(() => {
        setSnackbarAlertInfo({type:'success', message:'Form submitted successfuly.'})
        setOpen(true)
        setTimeout(() => {
             navigate("/template");
        }, 2000);

        })
        .catch((e) => {
          console.log(e);
              setSnackbarAlertInfo({
                type: "error",
                message: "Error submitting form.",
              });
              setOpen(true);
        });
  };


  const changeData = (data, type) => {
    setFormData((prevData) => ({
      ...prevData,
      [type]: data,
    }));
  };

  const fieldDataChange = (value, index, isNextField, type,j) => {
    const newFields = [...formData.fields];
    if (isNextField) {
      newFields[index].options[j].options[0][type] = value;
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
        navigate("/template");
        console.log("deleted", res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleChangeFieldType = (index, input, isNextField,j) => {
    const newFields = [...formData.fields];
    if (isNextField) {
      const nextField = _.cloneDeep(nextFieldTemplate);
      nextField.fieldType = input.value;
      if (!newFields[index].options[j].options) {
        newFields[index].options[j].options=[]
      }
        if (newFields[index]?.options[j]?.options?.length > 0) {
          newFields[index].options[j].options[0].fieldType = input.value;
        } else {
          newFields[index].options[j].options.push(nextField);
        }
       if (input.value === "TEXTBOX") {
       newFields[index].options[j].options[0].options = [
         { name: "", options: [] },
       ];
       }
    } else {
      if (input.value === 'TEXTBOX') {
        newFields[index].options = [{name:'',options:[]}];
      }
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

    setFormData((prevState) => ({
      ...prevState,
      fields: [...prevState.fields, nextFieldTemplate],
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
        <Alert
          onClose={handleClose}
          severity={snackbarAlertInfo.type}
          sx={{ width: "100%" }}
        >
          {snackbarAlertInfo.message}
        </Alert>
      </Snackbar>
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
                        value={field.name}
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
                                  newFields[index].options[j].options[k].name =
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
                                    <input type="radio" name={k} />
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
                                        newFields[index].options[j].options =
                                          [];
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
                              {childField.fieldType === "TEXTBOX" && (
                                <RegexSelect
                                  field={childField}
                                  index={index}
                                  isNextField={true}
                                  j={j}
                                  fieldDataChange={fieldDataChange}
                                />
                              )}
                              <RequiredCheckBox
                                nextField={true}
                                index={index}
                                j={j}
                                value={childField.isRequired}
                                fieldDataChange={fieldDataChange}
                              />
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
                      {field.fieldType === "TEXTBOX" && (
                        <RegexSelect
                          field={field}
                          index={index}
                          isNextField={false}
                          fieldDataChange={fieldDataChange}
                        />
                      )}
                      <RequiredCheckBox
                        nextField={false}
                        index={index}
                        value={field.isRequired}
                        fieldDataChange={fieldDataChange}
                      />
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
                navigate("/template");
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
