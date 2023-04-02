import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/SharedComponents/NavBar";
import { Box, Container, Stack } from "@mui/system";
import { Button, Typography } from "@mui/material";
import { useAuthStore } from "../store";
import axios from "axios";
import { useEffect, useState } from "react";
import TextboxComponentV2 from "../components/Form/TextboxComponentV2";
import CheckboxComponentV2 from "../components/Form/CheckboxComponentV2";
import RadioButtonComponentV2 from "../components/Form/RadioButtonComponentV2";
import FormHeader from "../components/Form/FormHeader";
import Swal from "sweetalert2";

const ViewForm = () => {
  const { id, revisionNo, workflowId } = useParams();
  const { role, token, accountId } = useAuthStore();
  const [formData, setFormData] = useState([]);
  const [fieldMap, setFieldMap] = useState({});
  const [regexMap, setRegexMap] = useState({});
  const [fieldResponses, setFieldResponses] = useState({});
  const [childFields, setChildFields] = useState({});
  const [idToIndex, setIdToIndex] = useState({});
  const [displayMap, setDisplayMap] = useState({});
  const [formDetails, setFormDetails] = useState({});
  const [formResponse, setFormResponse] = useState({});
  const [initialResponses, setInitialResponses] = useState({});

  let parentCounter = 0;
  const navigate = useNavigate();

  useEffect(() => {
    fetchRegexMap();
    fetchForm();
    fetchFormDetails();
    // Find existing submission that is draft
    fetchDraftSubmission();
  }, []);

  const initializeData = (data) => {
    let tempChildFields = [];
    let tempIdToIndex = {};
    let tempFieldMap = {};
    let tempDisplayMap = {};
    data.forEach((item, idx) => {
      tempIdToIndex[item.id] = idx;
      tempFieldMap[item.id] = item;
      tempDisplayMap[item.id] = true;
      if (item.fieldType === "RADIOBUTTON" || item.fieldType === "CHECKBOX") {
        let options = item.options;

        let temp = Object.values(options).filter((value) => value != null);
        tempChildFields = tempChildFields.concat(temp);
      }
    });

    tempChildFields.map((id) => {
      tempDisplayMap[id] = false;
    });
    let tempChildFieldsSet = new Set(tempChildFields);

    setChildFields(tempChildFieldsSet);
    setFieldMap(tempFieldMap);
    setIdToIndex(tempIdToIndex);
    setDisplayMap(tempDisplayMap);
  };

  useEffect(() => {
    let temp = {
      workflow_id: workflowId,
      fck: {
        id: id,
        revisionNo: revisionNo,
      },
      status: "DRAFT",
      submittedBy: accountId,
      fieldResponses,
      reviewer: null,
    };

    setFormResponse(temp);
    console.log(temp);
  }, [fieldResponses]);

  const fetchDraftSubmission = () => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}/api/formsubmission/getByWorkflowAndForm?workflowId=${workflowId}&formId=${id}&revisionNo=${revisionNo}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.data.length > 0) {
          let latestSubmission = res.data[res.data.length - 1];
          setInitialResponses(latestSubmission["fieldResponses"]);
          let tempFieldResponses = { ...fieldResponses };

          tempFieldResponses = latestSubmission["fieldResponses"];
          setFieldResponses(tempFieldResponses);

          let tempFormResponse = { ...formResponse };
          // console.log("formResponse", tempFormResponse);
          tempFormResponse["fieldResponses"] = tempFieldResponses;
          setFormResponse(tempFormResponse);
        }
      });
  };

  const fetchFormDetails = async () => {
    await axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}/api/forms/${id}/${revisionNo}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setFormDetails(res.data);
      });
  };

  const fetchForm = async () => {
    await axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}/api/forms/${id}/${revisionNo}/fields`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setFormData(res.data);
        initializeData(res.data);

        console.log("obj key init res", Object.keys(initialResponses));
        if (Object.keys(initialResponses).length == 0) {
          let temp = {};
          for (let i = 0; i < res.data.length; i++) {
            temp[res.data[i].id] = null;
          }
          setFieldResponses(temp);
        }
      });
  };

  const fetchRegexMap = async () => {
    await axios
      .get(process.env.REACT_APP_ENDPOINT_URL + "/api/regex", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        let temp = res.data.reduce((acc, curr) => {
          acc[curr.id] = curr;
          return acc;
        }, {});
        setRegexMap(temp);
      })
      .catch((e) => console.error(e));
  };

  const saveAsDraft = () => {
    axios
      .post(
        `${process.env.REACT_APP_ENDPOINT_URL}/api/formsubmission`,
        formResponse,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Draft has been saved. Redirecting...`,
          showConfirmButton: false,
          timer: 1500,
        }).then(() => navigate("/PastSubmissions"));
      })
      .catch((e) => console.log(e));
  };

  const submitForm = () => {
    formResponse["status"] = "AWAITING_ADMIN";
    axios
      .post(
        `${process.env.REACT_APP_ENDPOINT_URL}/api/formsubmission`,
        formResponse,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Form has been submitted. Redirecting...`,
          showConfirmButton: false,
          timer: 1500,
        }).then(() => navigate("/PastSubmissions"));
      })
      .catch((e) => console.log(e));
  };

  return (
    <Box>
      <NavBar />
      <Container component="main" maxWidth="lg" sx={{ p: 5 }}>
        <Stack spacing={3} sx={{ my: 2, px: 10 }}>
          <FormHeader formDetails={formDetails} />
          {formData?.map((field, idx) => {
            if (!childFields.has(field.id)) {
              parentCounter++;
              let parentElement;
              // Proceed to render parent
              if (field.fieldType === "TEXTBOX") {
                parentElement = (
                  <TextboxComponentV2
                    idx={parentCounter}
                    fieldData={field}
                    regexMap={regexMap}
                    fieldResponses={fieldResponses}
                    setFieldResponses={setFieldResponses}
                    isParent={true}
                    show={true}
                    initialResponses={initialResponses}></TextboxComponentV2>
                );
              } else if (field.fieldType === "RADIOBUTTON") {
                parentElement = (
                  <RadioButtonComponentV2
                    idx={parentCounter}
                    fieldData={field}
                    fieldResponses={fieldResponses}
                    setFieldResponses={setFieldResponses}
                    isParent={true}
                    show={true}
                    displayMap={displayMap}
                    setDisplayMap={setDisplayMap}
                    initialResponses={initialResponses}
                  />
                );
              } else {
                parentElement = (
                  <CheckboxComponentV2
                    idx={parentCounter}
                    fieldData={field}
                    fieldResponses={fieldResponses}
                    setFieldResponses={setFieldResponses}
                    isParent={true}
                    show={true}
                    initialResponses={initialResponses}
                  />
                );
              }
              // Proceed to render child if there are any
              let childElements;
              if (field.hasOwnProperty("options")) {
                let childToRender = Object.values(field.options).filter(
                  (value) => value != null
                );
                childElements = childToRender.map((i) => {
                  if (fieldMap[i].fieldType === "TEXTBOX") {
                    return (
                      <TextboxComponentV2
                        fieldData={fieldMap[i]}
                        regexMap={regexMap}
                        idx={idToIndex[i]}
                        fieldResponses={fieldResponses}
                        setFieldResponses={setFieldResponses}
                        isParent={false}
                        show={displayMap[i]}
                        initialResponses={
                          initialResponses
                        }></TextboxComponentV2>
                    );
                  } else if (fieldMap[i].fieldType === "RADIOBUTTON") {
                    return (
                      <RadioButtonComponentV2
                        idx={idToIndex[i]}
                        fieldData={fieldMap[i]}
                        fieldResponses={fieldResponses}
                        setFieldResponses={setFieldResponses}
                        isParent={false}
                        show={displayMap[i]}
                      />
                    );
                  } else if (fieldMap[i].fieldType === "CHECKBOX") {
                    return (
                      <CheckboxComponentV2
                        idx={idToIndex[i]}
                        fieldData={fieldMap[i]}
                        fieldResponses={fieldResponses}
                        setFieldResponses={setFieldResponses}
                        isParent={false}
                        show={displayMap[i]}
                      />
                    );
                  }
                });
              }
              return (
                <Stack
                  sx={{ bgcolor: "white", p: 5, borderRadius: 2 }}
                  spacing={2}>
                  {parentElement} {childElements?.map((i) => i)}
                </Stack>
              );
            }
          })}
          <Box sx={{ display: "flex", alignSelf: "end" }}>
            <Button variant="outlined" sx={{ mr: 2 }} onClick={saveAsDraft}>
              Save as Draft
            </Button>
            <Button variant="contained" color="action" onClick={submitForm}>
              Submit
            </Button>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default ViewForm;
