import { Box, Container, Stack } from "@mui/system";
import NavBar from "../components/SharedComponents/NavBar";
import FormHeader from "../components/Form/FormHeader";
import RadioButtonComponentV2 from "../components/Form/RadioButtonComponentV2";
import TextboxComponentV2 from "../components/Form/TextboxComponentV2";
import CheckboxComponentV2 from "../components/Form/CheckboxComponentV2";
import { useReactToPrint } from "react-to-print";
import { Button, Paper } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../store";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ViewSubmittedForm = () => {
  const { id, revisionNo, submissionId } = useParams();
  const { role, token, accountId, email } = useAuthStore();
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
  const [submissionDetails, setSubmissionDetails] = useState({});
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  let parentCounter = 0;
  const navigate = useNavigate();

  useEffect(() => {
    console.log("hehehe", submissionId);
    fetchSubmissionDetails();
    fetchFormDetails();
    fetchForm();
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
        if (res.data.length > 0) {
          console.log("submission details", res.data[res.data.length - 1]);
          setInitialResponses(res.data[res.data.length - 1]["fieldResponses"]);
          setSubmissionDetails(res.data[res.data.length - 1]);
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

  const handleApprove = (status) => {
    console.log("status", status);
    console.log("accountId", accountId);
    axios
      .put(
        `${process.env.REACT_APP_ENDPOINT_URL}/api/formsubmission/${submissionId}`,
        {
          status: status,
          reviewer: accountId,
        },
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
          text: `Form has been approved. Redirecting...`,
          showConfirmButton: false,
          timer: 1500,
        }).then(() => navigate("/PastApprovals"));
      })
      .catch((e) => {
        console.log(e);
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Unexpected error. Please make sure forms are reviewed in sequence",
          showConfirmButton: true,
        });
      });
  };

  const handleReject = (status) => {
    axios
      .put(
        `${process.env.REACT_APP_ENDPOINT_URL}/api/formsubmission/${submissionId}`,
        {
          status: status,
          reviewer: accountId,
        },
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
          text: `Form has been rejected. Redirecting...`,
          showConfirmButton: false,
          timer: 1500,
        }).then(() => navigate("/PastApprovals"));
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Unexpected error. Please make sure forms are reviewed in sequence",
          showConfirmButton: true,
        });
      });
  };

  const VendorActions = () => {
    let component;
    if (submissionDetails && submissionDetails.status === "DRAFT") {
      component = (
        <Button
          variant="contained"
          color="action"
          sx={{ mr: 2 }}
          onClick={() => {
            navigate(
              `/form/${id}/${revisionNo}/${submissionDetails["workflow"]["id"]}`
            );
          }}
        >
          Edit Submission
        </Button>
      );
    } else {
      <Button
        variant="contained"
        color="action"
        sx={{ mr: 2 }}
        onClick={() => {
          navigate(
            `/form/${id}/${revisionNo}/${submissionDetails["workflow"]["id"]}`
          );
        }}
        disabled={true}
      >
        Edit Submission
      </Button>;
    }
    return component;
  };

  const AdminActions = ({ handleApprove, handleReject, handlePrint }) => {
    let component;
    if (submissionDetails && submissionDetails.status === "AWAITING_ADMIN") {
      component = (
        <Box>
          <Button
            variant="contained"
            color="action"
            sx={{ mr: 2 }}
            onClick={() => handleApprove("AWAITING_APPROVER")}
          >
            Approve
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleReject("DRAFT")}
            sx={{ mr: 2 }}
          >
            Reject
          </Button>
          <Button variant="contained" onClick={handlePrint}>
            Print
          </Button>
        </Box>
      );
    } else if (
      submissionDetails &&
      submissionDetails.status === "DRAFT" &&
      submissionDetails.submittedBy.email === email
    ) {
      component = (
        <Button
          variant="contained"
          color="action"
          sx={{ mr: 2 }}
          onClick={() => {
            navigate(
              `/form/${id}/${revisionNo}/${submissionDetails["workflow"]["id"]}`
            );
          }}
        >
          Edit Submission
        </Button>
      );
    } else {
      component = (
        <Box>
          <Button
            variant="contained"
            color="action"
            sx={{ mr: 2 }}
            onClick={() => handleApprove("APPROVED")}
            disabled={true}
          >
            Approve
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleReject}
            disabled={true}
          >
            Reject
          </Button>
        </Box>
      );
    }
    return component;
  };

  const ApproverActions = () => {
    let component;
    if (submissionDetails && submissionDetails.status === "AWAITING_APPROVER") {
      component = (
        <Box>
          <Button
            variant="contained"
            color="action"
            sx={{ mr: 2 }}
            onClick={() => handleApprove("APPROVED")}
          >
            Approve
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleReject("AWAITING_ADMIN")}
          >
            Reject
          </Button>
        </Box>
      );
    } else {
      component = (
        <Box>
          <Button
            variant="contained"
            color="action"
            sx={{ mr: 2 }}
            onClick={handleReject}
            disabled={true}
          >
            Approve
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleReject("AWAITING_ADMIN")}
            disabled={true}
          >
            Reject
          </Button>
        </Box>
      );
    }
    return component;
  };

  return (
    <Box>
      <NavBar />
      <Container
        component="main"
        maxWidth="lg"
        sx={{ p: 5 }}
        ref={componentRef}
      >
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
                    initialResponses={initialResponses}
                    isSubmission={true}
                  ></TextboxComponentV2>
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
                    isSubmission={true}
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
                    isSubmission={true}
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
                        initialResponses={initialResponses}
                        isSubmission={true}
                      ></TextboxComponentV2>
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
                        initialResponses={initialResponses}
                        isSubmission={true}
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
                        isSubmission={true}
                      />
                    );
                  }
                });
              }
              return (
                <Stack
                  sx={{ bgcolor: "white", p: 5, borderRadius: 2 }}
                  spacing={2}
                >
                  {parentElement} {childElements?.map((i) => i)}
                </Stack>
              );
            }
          })}

          <Box sx={{ display: "flex", alignSelf: "end" }}>
            {role === "VENDOR" ? <VendorActions /> : ""}
            {role === "ADMIN" ? (
              <>
                <AdminActions
                  handleApprove={handleApprove}
                  handlePrint={handlePrint}
                  handleReject={handleReject}
                />
              </>
            ) : (
              ""
            )}
            {role === "APPROVER" ? (
              <ApproverActions
                handleApprove={handleApprove}
                handleReject={handleReject}
              />
            ) : (
              ""
            )}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default ViewSubmittedForm;
