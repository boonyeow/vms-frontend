import NavBar from "../components/SharedComponents/NavBar";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../store";
import { Box } from "@mui/system";
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
  const [form, setForm] = useState({});
  const [response, setResponse] = useState({});
    const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (event) => {
      setSelectedValue(event.target.value);
    };
  useEffect(() => {
    fetchForm(id);
  }, []);
 const handleSubmit = (event) => {
   event.preventDefault();
   if (formRef.current.reportValidity()) {
     console.log("Form submitted with values: ", form);
   } else {
     console.log("Form not valid");
     return;
   }
 };
  const fetchForm = (id) => {
    let data = null
    let fieldstodelete=[]
    axios
      .get(process.env.REACT_APP_ENDPOINT_URL + "/api/forms/" + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
       // setForm(res.data);
        data = res.data
        data.fields.forEach((field, index) => {
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
        console.log(data)
        setForm(data);
        let initResponse = {};
        Object.entries(res.data.fields).forEach(([key]) => {
          initResponse[key] = null;
        });
        //console.log(initResponse);
        console.log(form)
      });
  };

  return (
    <>
      <NavBar />
      <Card sx={{ maxWidth: 1000, marginTop: 3, marginX: "auto" }}>
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
                            />
                          ) : (
                            ""
                          )}
                          {field.fieldType == "TEXTBOX" ? (
                            <TextboxComponent fieldData={field} />
                          ) : (
                            ""
                          )}
                          {field.fieldType == "CHECKBOX" ? (
                            <CheckboxComponent fieldData={field} />
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
                                    <RadioButtonComponent fieldData={value} />
                                  ) : (
                                    ""
                                  )}
                                  {value.fieldType == "TEXTBOX" ? (
                                    <TextboxComponent fieldData={value} />
                                  ) : (
                                    ""
                                  )}
                                  {value.fieldType == "CHECKBOX" ? (
                                    <CheckboxComponent fieldData={value} />
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

const CheckboxComponent = ({ fieldData: field }) => {
  return (
    <FormGroup>
      <FormLabel id="">{field.name}</FormLabel>
      {Object.entries(field.nextFieldsId).map(([key, value]) => (
        <FormControlLabel
          control={
            <Checkbox
              required={field.isRequired}
              inputProps={{ "aria-label":{key} }}
            />
          }
          label={key}
        />
      ))}
    </FormGroup>
  );
};

const TextboxComponent = ({fieldData:field}) => {
  //console.log(field)
  return (
    <FormControl variant="standard">
      <InputLabel shrink htmlFor="bootstrap-input">
        {field.name}
      </InputLabel>
      <TextField id="bootstrap-input" required={field.isRequired} />
    </FormControl>
  );
};

const RadioButtonComponent = ({ fieldData: field }) => {
  //console.log(field);
  return (
    <FormControl>
      <FormLabel id="">{field.name}</FormLabel>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        name="radio-buttons-group"
      >
        {Object.entries(field.nextFieldsId).map(([key, value]) => (
          <FormControlLabel
            value={key}
            control={<Radio required={field.isRequired} />}
            label={key}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
const RadioStandaloneComponent = (
 {  fieldData ,
  handleChange, selectedValue}
) => {

  console.log(fieldData);
  return (
    <>
      <Stack direction="row" alignItems="center">
        <Radio
          checked={selectedValue === fieldData.name}
          onChange={ (e)=>handleChange(e)}
          value={fieldData.name}
          name="radionButtons"
          inputProps={{ "aria-label": fieldData.name }}
          required={fieldData.isRequired}
        />
        {fieldData.name}
      </Stack>
    </>
  );
};

export default ViewForm;
