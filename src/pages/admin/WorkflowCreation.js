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
import ErrorIcon from "@mui/icons-material/Error";
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

import { Navigate, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store";
import axios from "axios";
import Swal from "sweetalert2";

const WorkflowCreation = () => {
  
  const { token, role } = useAuthStore();
  const [formList, setFormList] = useState([]);

  const navigate = useNavigate();

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
        setFormList(res.data.filter(item=>item.isFinal));
      })
      .catch((e) => console.error(e));
  };
  
  useEffect(() => {
    fetchFormList();
  }, []);

  const [workflowData, setWorkflowData] = useState({
    id: null,
    name: null,
  });

  const [forms, setForms] = useState([]);

  const handleSaveDraft = () => {
    // this is essentially the same thing as submitting but with a couple of differences
    // 1. it's not final
    // 2. instead of redirecting to the main workflow management, it redirects to the editing page
    let error = 0;

      const workflowErrors = validateWorkflow(workflowData);
      setErrors(workflowErrors);
      if (Object.keys(workflowErrors).length === 0) {
        
        // step 1: create form
        axios
          .post(process.env.REACT_APP_ENDPOINT_URL + "/api/workflows", null, {
               headers: {
                   Authorization: `Bearer ${token}`,
                },
            })
          .then((response) => {

            // response data is simply the id of our newly-generated workflow
            // console.log("Posting...");
            // console.log(response.data);

            // step 2: throwing forms into the workflow
            forms.map((form, k) => {
              // console.log("Form-- Pos: " + form.pos + " ID: " + formList[form.pos].id.id + " Rev: " + formList[form.pos].id.revisionNo);
              axios
                .post(process.env.REACT_APP_ENDPOINT_URL + "/api/workflows/" + response.data + "/addForm", {
                
                  id: formList[form.pos].id.id,
                  revisionNo: formList[form.pos].id.revisionNo,
                
                }, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                })
                .then((response) => {
                })
                .catch((e) => {
                  ++error;
                  // console.error(e)
                });
            })
        
            // step: update our workflow info - left to last because final will lock it.
            axios
              .put(process.env.REACT_APP_ENDPOINT_URL + "/api/workflows/" + response.data, {
            
                name: workflowData.name,
                isFinal: false,
            
              }, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
              .then(() => {
                if (error==0) {
                  Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: "Redirecting...",
                    showConfirmButton: false,
                    confirmButtonColor: "#262626",
                    timer: 1500,
                  }).then(() => navigate("/WorkflowEditing", { state: { id: response.data, name: workflowData.name, isFinal: false } } ));
                } else {
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong! The operation may not have been completed.",
                    showCloseButton: false,
                    showConfirmButton: false,
                    timer: 1500,
                  }).then(() => navigate("/WorkflowMgmt"));
                }
              })
              .catch((e) => {
                ++error;
                //console.error(e);
              });
              


              })
            .catch((e) => {
              ++error;
              //console.error(e);
            });

            
          }
  }

  const handleSubmitWorkflow = () => {

    let error = 0;

      const workflowErrors = validateWorkflow(workflowData);
      setErrors(workflowErrors);
      if (Object.keys(workflowErrors).length === 0) {
        
        // step 1: create form
        axios
          .post(process.env.REACT_APP_ENDPOINT_URL + "/api/workflows", null, {
               headers: {
                   Authorization: `Bearer ${token}`,
                },
            })
          .then((response) => {

            // response data is simply the id of our newly-generated workflow
            // console.log("Posting...");
            // console.log(response.data);

            // step 2: throwing forms into the workflow
            forms.map((form, k) => {
              // console.log("Form-- Pos: " + form.pos + " ID: " + formList[form.pos].id.id + " Rev: " + formList[form.pos].id.revisionNo);
              axios
                .post(process.env.REACT_APP_ENDPOINT_URL + "/api/workflows/" + response.data + "/addForm", {
                
                  id: formList[form.pos].id.id,
                  revisionNo: formList[form.pos].id.revisionNo,
                
                }, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                })
                .then((r) => {
                })
                .catch((e) => {
                  ++error;
                  // console.error(e)
                });
            })
        
            // step: update our workflow info - left to last because final will lock it.
            axios
              .put(process.env.REACT_APP_ENDPOINT_URL + "/api/workflows/" + response.data, {
            
                name: workflowData.name,
                isFinal: false,
            
              }, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
              .then((r) => {
                axios
                  .post(process.env.REACT_APP_ENDPOINT_URL + "/api/workflows/" + response.data + "/publishWorkflow", null, {
                      headers: {
                          Authorization: `Bearer ${token}`,
                      },
                  })
                  .then((response) => {
                    if (error==0) {
                      Swal.fire({
                        icon: "success",
                        title: "Success!",
                        text: "Redirecting...",
                        showConfirmButton: false,
                        confirmButtonColor: "#262626",
                        timer: 1500,
                      }).then(() => navigate("/WorkflowMgmt"));
                    } else {
                      Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Something went wrong! The operation may not have been completed.",
                        showCloseButton: false,
                        showConfirmButton: false,
                        timer: 1500,
                      }).then(() => navigate("/WorkflowMgmt"));
                    }
                  })
                  .catch((e) => {error++;});
                
                
              })
              .catch((e) => {
                ++error;
                //console.error(e);
              });
              


              })
            .catch((e) => {
              ++error;
              //console.error(e);
            });

            
          }

            
  }

  const validateWorkflow = (data) => {
    const errors = {};
    if (!data.name) errors.name = "Workflow Title is required.";
    for (let i=0; i<forms.length; i++) {
      if (forms[i].pos=="-1") {
        errors[i] = "Invalid Form selected!";
      }
    }

    // console.log(errors);
    
    return errors;
  };

  const [errors, setErrors] = useState({});

  const handleAddForm = () => {
    const newForm = {
      pos: "-1",
    };
    setForms([...forms, newForm])
  }
  
  const changeData = (data, type) => {
      setWorkflowData((prevData) => ({
      ...prevData,
      [type]: data,
    }));
  }
  const handleDeleteForm = (index) => {
      const newForm = forms.filter((_, i) => i !== index);
      setForms(newForm);
  };
  
  const changeFormValue = (pos, index) => {
    let newForms = [...forms];
    newForms[index].pos = pos;
    setForms(newForms);
  }

  return ( ( role != "ADMIN") ? <Navigate replace to="/home" /> :
    <>
      <NavBar />
      <h1 style={{ textAlign: "center" }}>Workflow Creation</h1>
      <Card sx={{ maxWidth: 900, margin: "auto" }}>
        <CardContent>
          {/*<Stack spacing={2} direction="row">
            <TextField
              label="Workflow ID"
              variant="standard"
              onChange={(e) => changeData(e.target.value, "id")}
              required
              error={errors.id ? true : false}
              helperText={errors.id ? errors.id : ""}
            />
          </Stack>*/}
          <Stack spacing={2}>
            <TextField
              label="Workflow Title"
              variant="standard"
              onChange={(e) => changeData(e.target.value, "name")}
              required
              error={errors.name ? true : false}
              helperText={errors.name ? errors.name : ""}
            />
          </Stack>
          {forms.map((form, index) => (
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
                    <TextField // title
                      id="outlined-basic"
                      value={`Stage ${index + 1}`}
                      variant="standard"
                      InputProps={{
                        readOnly: true,
                      }}
                      error={errors[index] ? true : false}
                      helperText={errors[index] ? errors[index] : ""}
                      
                    />
                      
                    
                  </Stack>
                      <Grid
                        container
                        justifyContent="flex-start"
                        alignItems="center"
                      >
                        {
                          <>
                            <Grid item xs={0.5}>
                              <ShortTextIcon />
                            </Grid>
                            <Grid item xs={11}>
                              
                              <select
                                sx={{mr:2}}
                                style={{marginRight:5, width: 140, height:40, fontSize:15}}
                                onChange={(e) => {
                                  changeFormValue(e.target.value, index);
                                  
                                }}
                                value={form.pos}
                                >
                                  <option value="-1">Select A Form...</option>
                                {formList.map(
                                (input, k) =>
                                  
                                    <option value={k}>{input.name} (ID: {input.id.id}, Revision: {input.id.revisionNo})</option>
                                  
                                )}
                              </select>
                            </Grid>
                            <Grid item xs={0.5}>
                              {errors[index] && <Tooltip disableFocusListener title={errors[index]}><ErrorIcon style={{color: 'red'}} /></Tooltip>}
                            </Grid>
                            
                          </>
                        }
                      </Grid>
                  
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
                  <IconButton onClick={() => handleDeleteForm(index)}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              </CardActions>
            </Card>
          ))}
        </CardContent>
        <CardActions>
          <Button size="small" onClick={handleAddForm}>
            Add Form
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
              Publish Now
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
