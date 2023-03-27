import NavBar from "../components/SharedComponents/NavBar";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../store";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";


const ViewForm = (props) => {
  const formRef = useRef();
  const { token } = useAuthStore();
  const { id } = useParams();
  const { revisionNo } = useParams();
  const [form, setForm] = useState({});
  const { role } = useAuthStore();
    const navigate = useNavigate();
  const { accountId } = useAuthStore();
  const [fieldResponses, setFieldResponses] = useState({});
    const [selectedValue, setSelectedValue] = useState("");
  const [regexList, setRegexList] = useState([
    // {
    //   id: 1,
    //   name: "email",
    //   pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    // },
  ]);
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
    // console.log("recording response");
    console.log(`value: ${value}, id: ${id}`);
   // const obj = JSON.parse(value);
    //obj.name = JSON.parse(obj.name.replace(/\\/g, "")); // use if is checkbox
    //obj.ans = JSON.parse(obj.ans);

    // console.log(obj); // { id: 11, name: "test" }
    setFieldResponses((prevData) => ({
      ...prevData,
      [parseInt(id)]: value,
    }));
    console.log(fieldResponses)
  }
  const handleSubmit = async (event) => {
    const formData = {
      workflow_id: 1,
      fck: {
        id: parseInt(id),
        revisionNo: parseInt(revisionNo),
      },
      submittedBy: accountId,
      fieldResponses: fieldResponses,
    };
    event.preventDefault();
    console.log(formData);
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
      .then((res) => {
       // setForm(res.data);
        console.log(res.data)
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
        let initResponse = {};
        Object.entries(res.data.fields).forEach(([key]) => {
          initResponse[key] = null;
        });
        //console.log(initResponse);
       // console.log(form)
      });
  };

  return (
    <>
      <NavBar />
      <Card sx={{ maxWidth: 900, marginTop: 3, marginX: "auto" }}>
            <form ref={formRef} onSubmit={handleSubmit}>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center">
            {form.name}
          </Typography>
          <Divider sx={{ marginY: 3 }} />
          <Typography variant="h6" gutterBottom>
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
                            />
                          ) : (
                            ""
                          )}
                          {field.fieldType == "TEXTBOX" ? (
                            <TextboxComponent
                              fieldData={field}
                              recordResponse={recordResponse}
                            />
                          ) : (
                            ""
                          )}
                          {field.fieldType == "CHECKBOX" ? (
                            <CheckboxComponent
                              fieldData={field}
                              recordResponse={recordResponse}
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
                                    />
                                  ) : (
                                    ""
                                  )}
                                  {value.fieldType == "TEXTBOX" ? (
                                    <TextboxComponent
                                      fieldData={value}
                                      recordResponse={recordResponse}
                                    />
                                  ) : (
                                    ""
                                  )}
                                  {value.fieldType == "CHECKBOX" ? (
                                    <CheckboxComponent
                                      fieldData={value}
                                      recordResponse={recordResponse}
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

              <Button variant="contained" type='submit'>
                Submit
              </Button>
          </CardActions>
            </form>
      </Card>
    </>
  );
};

const CheckboxComponent = ({ fieldData, recordResponse }) => {
  const options = Object.entries(fieldData.nextFieldsId);
  const optionCount = options.length;
  const optionNames = options.map(([name]) => name);

  const handleChange = (optionIndex, checked) => {
    const selectedOptions = Array(optionCount).fill(false);
    selectedOptions[optionIndex] = checked;
    const response = {
      type: "checkbox",
      name: JSON.stringify(optionNames),
      ans: JSON.stringify(selectedOptions),
    };
    recordResponse(JSON.stringify(response), fieldData.id);
  };

  return (
    <>
      <FormGroup>
        <FormLabel id="">{fieldData.name}</FormLabel>
        {options.map(([name], index) => (
          <FormControlLabel
            key={name}
            control={
              <Checkbox
                required={fieldData.isRequired}
                inputProps={{ "aria-label": name }}
                onChange={(e) => handleChange(index, e.target.checked)}
              />
            }
            label={name}
          />
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


const TextboxComponent = ({ fieldData, recordResponse}) => {
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
        onBlur={(e) => {
          handleInputChange(e);
          recordResponse(
            e.target.value,
            fieldData.id
          );
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

const RadioButtonComponent = ({ fieldData, recordResponse}) => {
  //console.log(fieldData);
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
                control={<Radio required={fieldData.isRequired} />}
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
}) => {
  //console.log(fieldData);
  return (
    <>
      <Stack direction="row" alignItems="center">
        <Radio
          checked={selectedValue === fieldData.name}
          onChange={(e) => handleChange(e)}
          value={fieldData.name}
          name="radionButtons"
          inputProps={{ "aria-label": fieldData.name }}
          required={fieldData.isRequired}
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
