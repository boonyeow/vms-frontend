// Workflow model has this attribute which is a list of approvalSequence. It stores a list of Form ID.
// Meaning if approvalSequence = [2,1,3].
// It means that Form with Id 2 is first, then 1, then 3.
import NavBar from "../../components/SharedComponents/NavBar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
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
import CardHeader from "@mui/material/CardHeader";

import { useAuthStore } from "../../store";
import axios from "axios";
// import "sweetalert2/dist/sweetalert2.min.css";

const WorkflowCreation = () => {
  
  const { token } = useAuthStore();
  const [formList, setFormList] = useState([]);

  const fetchFormList = async () => {
    axios
      .get(process.env.REACT_APP_ENDPOINT_URL + "/api/forms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log("fetching form list", res);
        // console.log("here's where i would put my data", res.data);
        setFormList(res.data);
      })
      .catch((e) => console.error(e));
  };

  useEffect(() => {
    fetchFormList();
  }, []);

  const [stageTypes, setStageTypes] = useState([
    { name: "Forms", value: "forms" },
    { name: "Approver Review", value: "approverReview" },
    { name: "Admin Review", value: "adminReview" }
    
  ]);
  const handleAddInput = (index, stageType) => {
    const newSections = [...sections];
    newSections[index].stageType = stageType.value;
    if (stageType == 'forms') {
      newSections[index].options[0].options_value = '';
    }
    setSections(newSections);
  };
  const [formData, setFormData] = useState({
    id: null,
    name: null,
    description: null,
    isFinal: false,
    fields: [],
    authorizedAccountIds:[]
  });
  const [sections, setSections] = useState([]);
  const changeQuestion = (text,i) => {
    let newQuestion = [...sections];
    newQuestion[i].questionText = text;
    setSections(newQuestion)
  }
  const handleSaveDraft = () => {
   const newFormData = {
     ...formData, // copy existing formData properties
     fields: sections, // add fields property with the value of sections
     isFinal: false, // set isFinal to false
    };
    console.log(newFormData)
    //save form
  }

  // seb look here
  // i tried with the empty and it didn't seem to work either
  // const handleSubmitWorkflow = () => {
  //   const newFormData = {
  //     ...formData, // copy existing formData properties
  //     fields: sections, // add fields property with the value of sections
  //     isFinal: true, // set isFinal to false
  //   };
  //    const formErrors = validateForm(newFormData);
  //     setErrors(formErrors);
    // 
  //     if (Object.keys(formErrors).length === 0) {
  //       axios
  //         .post(process.env.REACT_APP_ENDPOINT_URL + "/api/workflows", {
  //              headers: {
  //                  Authorization: `Bearer ${token}`,
  //               },
  //           })
  //         .then(() => {
  //         })
  //         .catch((e) => console.error(e));
  //     };
  //       console.log("Form submitted:", formData);
  //     }

  // let me try remember which was the other thing
  // - post to create new workflow (works)
  // - assign workflow to user (components -> users -> assignworkflowmodal -> line 65, also on workflowmgmt page (click workflow then assign, select user, okay))
  // - publish existing workflow (workflowlist -> line 68, on workflowmgmt page)
      const handleSubmitWorkflow = () => {
         axios
           .post(process.env.REACT_APP_ENDPOINT_URL + "/api/workflows", {
                headers: {
                    Authorization: `Bearer ${token}`,
                 },
             })
           .then((response) => {
            console.log(response);
           })
           .catch((e) => console.error(e));
       };
  
const validateForm = (data) => {
  const errors = {};
  if (!data.id) errors.id = "Workflow ID is required.";
  // if (!data.revision) errors.revision = "Revision # is required.";
  if (!data.name) errors.name = "Workflow Title is required.";
  return errors;
};
  const [errors, setErrors] = useState({});
  const handleAddSection = () => {
    const newSection = {
      questionText: "",
      stageType: "forms" ,
      options: [{ options_value: "", nextFieldId:null}],
      required: false,
      regex: null,
    };
    setSections([...sections, newSection])
  }
  const changeData = (data, type) => {
 setFormData((prevData) => ({
   ...prevData,
   [type]: data,
 }));
  }
  const handleDeleteSection = (index) => {
      const newSection = sections.filter((_, i) => i !== index);
      setSections(newSection);
  };
  const handleDeleteOption = (sectionNo, optionNo) => {
    const newSections = [...sections];
    if (newSections[sectionNo].options.length > 1) {
      newSections[sectionNo].options.splice(optionNo, 1);
      setSections(newSections)
    }
    // newSections[sectionNo].options.splice(optionNo, 1)
  };
  const changeOptionValue = (text, index,j) => {
    let newSections = [...sections];
    newSections[index].options[j].options_value = text;
    setSections(newSections)
  }

  const handleAddOption = (index) => {
    const newSections = [...sections];
    if (newSections[index].options.length < 10) {
      newSections[index].options.push({ options_value: "" });
    } else {
      console.log("max 10 options")
    }
    setSections(newSections)
  }

  return (
    <>
      <NavBar />
      <h1 style={{ textAlign: "center" }}>Workflow Creation</h1>
      <Card sx={{ maxWidth: 900, margin: "auto" }}>
        <CardContent>
          <Stack spacing={2} direction="row">
            <TextField
              label="Workflow ID"
              variant="standard"
              onChange={(e) => changeData(e.target.value, "id")}
              required
              error={errors.id ? true : false}
              helperText={errors.id ? errors.id : ""}
            />
          </Stack>
          <Stack spacing={2}>
            <TextField
              label="Workflow Title"
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
          </Stack>
          {sections.map((section, index) => (
            <Card
              sx={{ maxWidth: 900, margin: "auto", marginTop: 2 }}
              key={index}
            >
              <CardContent>
                <Stack spacing={2}>
                  <Stack
                    spacing={2}
                    direction="row"
                    justifyContent="space-between"
                  >
                    <TextField // verify textfield
                      id="outlined-basic"
                      value={`Stage ${index + 1}`}
                      //label="none"
                      variant="standard"
                      onChange={(e) => changeQuestion(e.target.value, index)}
                      InputProps={{
                        readOnly: true,
                      }}
                      
                    />
                    <Box sx={{ flexGrow: 0 }} key={index}>
                      <PopupState variant="popover" popupId="demo-popup-menu">
                        {(popupState) => (
                          <React.Fragment>
                            {!section.stageType ? (
                              <IconButton {...bindTrigger(popupState)}>
                                <AddCircleIcon />
                              </IconButton>
                            ) : (
                              <IconButton {...bindTrigger(popupState)}>
                                <EditIcon />
                              </IconButton>
                            )}
                            <Menu {...bindMenu(popupState)}>
                              {stageTypes.map(
                                (input, k) =>
                                  section.stageType !== input.value && (
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close();
                                        handleAddInput(index, input);
                                      }}
                                      key={`${index}-${k}`}
                                    >
                                      <Typography textAlign="center">
                                        {input.name}
                                      </Typography>
                                    </MenuItem>
                                  )
                              )}
                            </Menu>
                          </React.Fragment>
                        )}
                      </PopupState>
                    </Box>
                  </Stack>
                  {section.options.map((op, j) => (
                    <>
                      <Grid
                        container
                        justifyContent="flex-start"
                        alignItems="center"
                      >
                        {section.stageType !== "forms" ? (
                          <>
                          <TextField // actual textfield
                                
                                name={index}
                                value={section.stageType}
                                variant="standard"
                                InputProps={{
                                  readOnly: true,
                                  sx: { display: "none" },
                                }}
                            />
                            <TextField // dummy
                                
                                value={section.stageType == "approverReview" ? "Approver Review" : "Admin Review"}
                                variant="standard"
                                InputProps={{
                                  readOnly: true,
                                }}
                            />
                          </>
                        ) : (
                          <>
                            <Grid item xs={1}>
                              <ShortTextIcon />
                            </Grid>
                            <Grid item xs={11}>
                              
                              <select
                                sx={{mr:2}}
                                style={{marginRight:5, width: 140, height:40, fontSize:15}}
                                onChange={(e) => {
                                  changeOptionValue(e.target.value, index, j);
                                }}> {/* boonyeow look here */}
                                {formList.map(
                                (input, k) =>
                                  input.isFinal !== false && (
                                    <option value={input.id.id}>{input.name} (ID: {input.id.id})</option>
                                  )
                                )}
                              </select>
                            </Grid>
                          </>
                        )}
                        {op.nextFieldId === "text" ? (
                          <>
                            <TextField
                              variant="outlined"
                              size="small"
                              InputProps={{
                                endAdornment: (
                                  {/* */}
                                ),
                              }}
                            />
                          </>
                        ) : (
                          ""
                        )}
                        {j == 0 ? (
                          ""
                        ) : (
                          <Grid item xs={1}>
                            <IconButton
                              aria-label="delete"
                              onClick={() => handleDeleteOption(index, j)}
                            >
                              <CloseIcon />
                            </IconButton>
                          </Grid>
                        )}
                      </Grid>
                    </>
                  ))}

                  {section.stageType === "forms" ? (
                    <Stack alignItems="flex-start">
                      <Button
                        variant="text"
                        color="primary"
                        onClick={() => handleAddOption(index)}
                      >
                        Add Form
                      </Button>
                    </Stack>
                  ) : (
                    ""
                  )}

                  {/* {section.inputType === "Radiobutton" && <RadioButtonInput />} */}
                </Stack>
              </CardContent>
              <CardActions>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                  }}
                >
                  <IconButton onClick={() => handleDeleteSection(index)}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              </CardActions>
            </Card>
          ))}
        </CardContent>
        <CardActions>
          <Button size="small" onClick={handleAddSection}>
            Add Section
          </Button>
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
              style={{ backgroundColor: "grey" }}
              onClick={handleSaveDraft}
            >
              Save as Draft
            </Button>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={handleSubmitWorkflow}
            >
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
export default WorkflowCreation;
