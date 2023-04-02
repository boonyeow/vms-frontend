import { Box, Container, Stack } from "@mui/system";
import NavBar from "../components/SharedComponents/NavBar";
import FormHeader from "../components/Form/FormHeader";
import RadioButtonComponentV2 from "../components/Form/RadioButtonComponentV2";
import TextboxComponentV2 from "../components/Form/TextboxComponentV2";
import CheckboxComponentV2 from "../components/Form/CheckboxComponentV2";
import { Button } from "@mui/material";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../store";
import { useEffect, useState } from "react";
import axios from "axios";

const ViewSubmittedForm = () => {
  const { id, revisionNo, submissionId } = useParams();
  const { role, token, accountId } = useAuthStore();
  const [formDetails, setFormDetails] = useState({});

  useEffect(() => {
    // console.log("hehehe", submissionId);
    fetchSubmissionDetails();
  }, []);

  const fetchSubmissionDetails = () => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}/api/formsubmission/getById?formSubmissionId=${submissionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
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

  // const fetchForm = async () => {
  //   await axios
  //     .get(
  //       `${process.env.REACT_APP_ENDPOINT_URL}/api/forms/${id}/${revisionNo}/fields`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     )
  //     .then((res) => {
  //       setFormData(res.data);
  //       initializeData(res.data);

  //       console.log("obj key init res", Object.keys(initialResponses));
  //       if (Object.keys(initialResponses).length == 0) {
  //         let temp = {};
  //         for (let i = 0; i < res.data.length; i++) {
  //           temp[res.data[i].id] = null;
  //         }
  //         setFieldResponses(temp);
  //       }
  //     });
  // };

  return (
    <Box>
      <NavBar />
      {/* <Container component="main" maxWidth="lg" sx={{ p: 5 }}>
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
                        show={displayMap[i]}></TextboxComponentV2>
                    );
                  } else if (fieldMap[i].fieldType === "RADIOBUTTON") {
                    return (
                      <RadioButtonComponentV2
                        idx={idToIndex[i]}
                        fieldData={fieldMap[i]}
                        fieldResponses={fieldResponses}
                        setFieldResponses={setFieldResponses}
                        isParent={false}
                        show={true}
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
      </Container> */}
    </Box>
  );
};

export default ViewSubmittedForm;
