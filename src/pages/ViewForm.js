import NavBar from "../components/SharedComponents/NavBar";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../store";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { Paper } from "@mui/material";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputLabel,
  Radio,
  RadioGroup,
  TextField,
  Card,
  CardContent,
  CardActions,
  Typography,
  Divider,
  Stack,
  Button,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";


const ViewForm = (props) => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const formRef = useRef();
  const { id,submissionid, workflowId, revisionNo } = useParams();
  const [form, setForm] = useState({});
  const { role, token, accountId } = useAuthStore();
  const [readOnly, setReadOnly]=useState(false)
  const navigate = useNavigate();
  const [submittedResponse, setSubmittedResponse] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const [fieldResponses, setFieldResponses] = useState({});
  const [selectedValue, setSelectedValue] = useState("");
  const [submittedForm, setSubmittedForm] = useState();
  const [regexList, setRegexList] = useState([
    // {
    //   id: 1,
    //   name: "email",
    //   pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    // },
  ]);

  const handleNewStatusChange = async (value) => {
    let newStatus;

    if (role === "ADMIN" && value === "approve") {
        newStatus="AWAITING_APPROVER";
    } else if (role === "APPROVER" && value === "approve") {
        newStatus ="APPROVED";
    } else {
        newStatus ="REJECTED";
    }
     await axios
       .put(
         process.env.REACT_APP_ENDPOINT_URL +
           `/api/formsubmission/${submissionid}`,
      {status: newStatus} ,
         {
           headers: {
             Authorization: `Bearer ${token}`,
           },
         }
       )
       .then(() => {
         fetchForm(id);
       })
       .catch((e) => {
         console.log(e);
       });
  };
  const handleChange = (event) => {
      setSelectedValue(event.target.value);
    };
  useEffect(() => {
     getRegexList()
       .then(() => fetchForm(id))
       .catch((error) => console.log(error));
  }, []);

  const getRegexList = async () => {
   await axios
      .get(process.env.REACT_APP_ENDPOINT_URL + "/api/regex", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        //console.log(res.data)
        setRegexList(res.data);
      })
      .catch((e) => console.error(e));
}
  const recordResponse = (value, id) => {
    setFieldResponses((prevData) => ({
      ...prevData,
      [parseInt(id)]: value,
    }));
    //console.log(fieldResponses)
  }
  const handleSubmit = async (event) => {
    const formData = {
      workflow_id: workflowId,
      fck: {
        id: parseInt(id),
        revisionNo: parseInt(revisionNo),
      },
      submittedBy: accountId,
      fieldResponses: fieldResponses,
    };
    event.preventDefault();
   if (formRef.current.reportValidity()) {
     console.log("Form submitted with values: ", form);
     await axios
      .post(
        process.env.REACT_APP_ENDPOINT_URL +
          '/api/formsubmission',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(async (res) => {
        navigate("../../home");
      })
      .catch((e) => {
        console.log(e);
      });
   } else {
     console.log("Form not valid");
     return;
   }
 };
  const fetchForm = async (id) => {
    let data = null
    let fieldstodelete = []
     await axios
      .get(process.env.REACT_APP_ENDPOINT_URL + "/api/forms/" + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async (res) => {
        data = res.data
        data.fields.forEach((field, index) => {
          if (field.regexId) {
            let regex = regexList.filter((obj) => obj.id == field.regexId);
            field.regexId=regex[0]
          }

          if (field.nextFieldsId) {
            for (const [key, value] of Object.entries(field.nextFieldsId)) {
              if (typeof value === 'number') {
                let nestedField = data.fields.filter((field) => field.id == value)
                field.nextFieldsId[key] = nestedField[0]
                fieldstodelete.push(nestedField[0].id)
              }
            }
          }
        })

        data.fields = data.fields.filter(
          (obj) => !fieldstodelete.includes(obj.id)
        );
       // console.log(data)
        setForm(data);
        console.log(data.fields)
        let initResponse = {};
        Object.entries(res.data.fields).forEach(([key]) => {
          initResponse[key] = null;
        });
        console.log(role)

        if (
          role === "ADMIN" ||
          role === "APPROVER" ||
          (role === "VENDOR" && submissionid!==undefined)
        ) {
          setReadOnly(true);
          await axios
            .get(
              process.env.REACT_APP_ENDPOINT_URL +
                `/api/formsubmission/getById?formSubmissionId=${submissionid}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then(async (res) => {
              console.log(res.data);
              let responses = res.data[0].fieldResponses;
              setCurrentStatus(res.data[0].status);
              for (const [key, value] of Object.entries(responses)) {
                try {
                  let obj = JSON.parse(value);
                  obj.ans = JSON.parse(obj.ans);
                  if (obj.type === "checkbox") {
                    obj.name = JSON.parse(obj.name.replace(/\\/g, ""));
                  }
                  responses[key] = obj;
                } finally {
                  continue;
                }
              }
              console.log(responses);
              setSubmittedResponse(responses);
            })
            .catch((e) => {
              console.log(e);
            });
        }

      });
  };
if (!submittedResponse && role!=='VENDOR') {
  return <div>Loading...</div>;
}
  return (
    <>
      <NavBar />

      {role === "VENDOR" ? (
        ""
      ) : (
        <Stack
          direction="row"
          justifyContent="space-around"
          alignItems="flex-end"
          spacing={2}
          sx={{ marginTop: 2 }}
        >
          <StatusToggleComponent
            status={currentStatus}
            role={role}
            handleNewStatusChange={handleNewStatusChange}
          />
        </Stack>
      )}
      <Card sx={{ maxWidth: 900, marginTop: 1, marginX: "auto" }}>
        {role === "VENDOR" ? (
          ""
        ) : (
          <StatusAlertComponent status={currentStatus} />
        )}

        <form ref={formRef} onSubmit={handleSubmit}>
          <CardContent ref={componentRef}>
            <Typography variant="h4" gutterBottom align="center">
              {form.name}
            </Typography>
            <Divider sx={{ marginY: 3 }} />
            <Typography variant="h6" gutterBottom sx={{paddingX:2}}>
              {form.description}
            </Typography>
            <Divider sx={{ marginY: 3 }} />

            <Box>
              {form.fields?.map((field, idx) => {
                return (
                  <Card>
                    <CardContent>
                      <Stack
                        direction="row"
                        justifyContent="space-around"
                        alignItems="center"
                        spacing={2}
                      >
                        <Stack>
                          <Box>
                            {/* {idx} */}
                            {/* {field.name} */}
                          </Box>
                          {field.fieldType == "RADIOBUTTON" ? (
                            <RadioStandaloneComponent
                              fieldData={field}
                              handleChange={handleChange}
                              selectedValue={selectedValue}
                              recordResponse={recordResponse}
                              readOnly={readOnly}
                              submittedResponse={submittedResponse}
                            />
                          ) : (
                            ""
                          )}
                          {field.fieldType == "TEXTBOX" ? (
                            <TextboxComponent
                              fieldData={field}
                              recordResponse={recordResponse}
                              readOnly={readOnly}
                              submittedResponse={submittedResponse}
                            />
                          ) : (
                            ""
                          )}
                          {field.fieldType == "CHECKBOX" ? (
                            <CheckboxComponent
                              fieldData={field}
                              recordResponse={recordResponse}
                              readOnly={readOnly}
                              submittedResponse={submittedResponse}
                            />
                          ) : (
                            ""
                          )}
                        </Stack>
                        <Stack>
                          {field.nextFieldsId &&
                            Object.entries(field.nextFieldsId).map(
                              ([key, value]) => (
                                // Render your components here for each key/value pair in nextFieldsId
                                // You can use key and value to access each pair
                                <>
                                  {/* <div key={key}>{value.fieldType}</div> */}
                                  {value.fieldType == "RADIOBUTTON" ? (
                                    <RadioButtonComponent
                                      fieldData={value}
                                      recordResponse={recordResponse}
                                      readOnly={readOnly}
                                      submittedResponse={submittedResponse}
                                    />
                                  ) : (
                                    ""
                                  )}
                                  {value.fieldType == "TEXTBOX" ? (
                                    <TextboxComponent
                                      fieldData={value}
                                      recordResponse={recordResponse}
                                      readOnly={readOnly}
                                      submittedResponse={submittedResponse}
                                    />
                                  ) : (
                                    ""
                                  )}
                                  {value.fieldType == "CHECKBOX" ? (
                                    <CheckboxComponent
                                      fieldData={value}
                                      recordResponse={recordResponse}
                                      readOnly={readOnly}
                                      submittedResponse={submittedResponse}
                                    />
                                  ) : (
                                    ""
                                  )}
                                </>
                              )
                            )}
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          </CardContent>
          <CardActions>
            {role === "VENDOR" && submissionid===undefined ? (
              <Button variant="contained" type="submit">
                Submit
              </Button>
            ) : (
              ""
            )}
            {role === "ADMIN" ? (
              <Button variant="contained" onClick={handlePrint}>
                Print
              </Button>
            ) : (
              ""
            )}
          </CardActions>
        </form>
      </Card>
    </>
  );
};

const StatusAlertComponent = ({ status }) => {
   const severity = status.includes('AWAITING')
    ? 'warning'
    : status === 'APPROVED'
    ? 'success'
    : 'error';
  return (
    <Alert severity={severity} sx={{ width: "100%" }}>
      Status: {status}
    </Alert>
  );
};

const CheckboxComponent = ({
  fieldData,
  recordResponse,
  readOnly,
  submittedResponse,
}) => {
 const options = Object.entries(fieldData.nextFieldsId);
 const optionCount = options.length;
 const optionNames = options.map(([name]) => name);
 const [selectedOptions, setSelectedOptions] = useState(
   Array(optionCount).fill(false)
 );

 const handleChange = (optionIndex, checked) => {
   const updatedSelectedOptions = [...selectedOptions];
   updatedSelectedOptions[optionIndex] = checked;
   setSelectedOptions(updatedSelectedOptions);
   const response = {
     type: "checkbox",
     name: JSON.stringify(optionNames),
     ans: JSON.stringify(updatedSelectedOptions),
   };
   recordResponse(JSON.stringify(response), fieldData.id);
 };

  return (
    <>
      <FormGroup>
        <FormLabel id="">{fieldData.name}</FormLabel>
        {options.map(([name], index) => (
          <>
            <FormControlLabel
              key={name}
              control={
                <Checkbox
                  required={fieldData.isRequired}
                  checked={
                    submittedResponse &&
                    submittedResponse[fieldData.id] &&
                    submittedResponse[fieldData.id].name[index] == name &&
                    submittedResponse[fieldData.id].ans[index]
                      ? true
                      : undefined
                  }
                  inputProps={{ "aria-label": name }}
                  onChange={(e) => handleChange(index, e.target.checked)}
                  InputProps={{
                    readOnly: readOnly,
                  }}
                />
              }
              label={name}
            />
          </>
        ))}
      </FormGroup>
      <Stack>
        <Typography variant="caption" display="block" gutterBottom>
          {fieldData.helpText}
        </Typography>
      </Stack>
    </>
  );
};

const StatusToggleComponent = ({
  status,
  role,
  handleNewStatusChange,
  submittedResponse,
}) => {
  const [toggleValue, setToggleValue] = useState("");
  return (
    <ToggleButtonGroup
      color="primary"
      exclusive
      aria-label="Platform"
      value={toggleValue}
      disabled={role === "APPROVER" && status === "AWAITING_ADMIN"}
      onChange={(e) => {
        handleNewStatusChange(e.target.value);
        setToggleValue(e.target.value);
      }}
    >
      <ToggleButton value="approve">Approve</ToggleButton>
      <ToggleButton value="reject">Reject</ToggleButton>
    </ToggleButtonGroup>
  );
};

const TextboxComponent = ({
  fieldData,
  recordResponse,
  readOnly,
  submittedResponse,
}) => {
  const [inputError, setInputError] = useState("");
  const handleInputChange = (event) => {
    if (fieldData.regexId) {
      const value = event.target.value;
      const regex = new RegExp(fieldData.regexId.pattern);
      const isValid = regex.test(value);
      if (!isValid && value !== "") {
        setInputError(
          `Please enter a correct ${fieldData.regexId.name} format`
        );
      } else {
        setInputError("");
      }
    }
  };
  return (
    <>
      <InputLabel shrink htmlFor="bootstrap-input">
        {fieldData.name}
      </InputLabel>
      <TextField
        id="bootstrap-input"
        variant="standard"
        required={fieldData.isRequired}
        helperText={inputError}
        error={!!inputError}
        value={submittedResponse? submittedResponse[fieldData.id] : undefined}
        onBlur={(e) => {
          handleInputChange(e);
          recordResponse(e.target.value, fieldData.id);
        }}
        InputProps={{
          readOnly: readOnly,
        }}
      />
      <Stack>
        <Typography variant="caption" display="block" gutterBottom>
          {fieldData.helpText}
        </Typography>
      </Stack>
    </>
  );
};

const RadioButtonComponent = ({
  fieldData,
  recordResponse,
  readOnly,
  submittedResponse,
}) => {
  //console.log(readOnly);
  return (
    <>
      <FormControl>
        <FormLabel id="">{fieldData.name}</FormLabel>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
        >
          {fieldData.nextFieldsId &&
            Object.entries(fieldData.nextFieldsId).map(([key, value]) => (
              <FormControlLabel
                value={key}
                control={
                  <Radio
                    required={fieldData.isRequired}
                    disabled={readOnly}
                    checked={
                      submittedResponse &&
                      submittedResponse[fieldData.id] &&
                      submittedResponse[fieldData.id].name == key &&
                      submittedResponse[fieldData.id].ans
                    }
                  />
                }
                label={key}
                onChange={(e) =>
                  recordResponse(
                    e.target.checked
                      ? `{"type":"radio","name":"${key}","ans":"true"}`
                      : `{ "type":"radio","name":"${key}","ans":"false"}`,
                    fieldData.id
                  )
                }
              />
            ))}
        </RadioGroup>
      </FormControl>
      <Stack>
        <Typography variant="caption" display="block" gutterBottom>
          {fieldData.helpText}
        </Typography>
      </Stack>
    </>
  );
};
const RadioStandaloneComponent = ({
  fieldData,
  handleChange,
  selectedValue,
  recordResponse,
  readOnly,
  submittedResponse,
}) => {
  return (
    <>
      <Stack direction="row" alignItems="center">
        <Radio
          // checked={selectedValue === fieldData.name}
          disabled={readOnly}
          checked={
            submittedResponse &&
            submittedResponse[fieldData.id] &&
            submittedResponse[fieldData.id].name == fieldData.name &&
            submittedResponse[fieldData.id].ans
              ? true
              : selectedValue === fieldData.name
          }
          onChange={(e) => {
            handleChange(e);
            recordResponse(
              e.target.checked
                ? `{"type":"radio","name":"${fieldData.name}","ans":"true"}`
                : `{ "type":"radio","name":"${fieldData.name}","ans":"false"}`,
              fieldData.id
            );
          }}
          value={fieldData.name}
          name="radionButtons"
          inputProps={{ "aria-label": fieldData.name }}
          required={fieldData.isRequired}
          InputProps={{
            readOnly: readOnly,
          }}
        />
        {fieldData.name}
      </Stack>
      <Stack>
        <Typography variant="caption" display="block" gutterBottom>
          {fieldData.helptext}
        </Typography>
      </Stack>
    </>
  );
};

export default ViewForm;
