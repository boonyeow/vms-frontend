import { useEffect, useState } from "react";
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
} from "@mui/material";

const ViewForm = (props) => {
  const { token } = useAuthStore();
  const { id } = useParams();
  const [form, setForm] = useState({});
  const [response, setResponse] = useState({});
  useEffect(() => {
    fetchForm(id);
  }, []);

  const fetchForm = (id) => {
    axios
      .get(process.env.REACT_APP_ENDPOINT_URL + "/api/forms/" + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setForm(res.data);
        let initResponse = {};
        Object.entries(res.data.fields).forEach(([key]) => {
          initResponse[key] = null;
        });
        console.log(initResponse);
      });
  };

  return (
    <Box>
      <Box>form name: {form.name}</Box>
      <Box>form description: {form.description}</Box>
      <Box>
        {form.fields?.map((x, idx) => {
          return (
            <Box>
              <Box>
                {idx}
                {x.name}
              </Box>
              {x.fieldType == "RADIOBUTTON" ? <RadioButtonComponent /> : ""}
              {x.fieldType == "TEXTBOX" ? <TextboxComponent /> : ""}
              {x.fieldType == "CHECKBOX" ? <CheckboxComponent /> : ""}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

const CheckboxComponent = (data) => {
  return (
    <FormGroup>
      <FormControlLabel control={<Checkbox />} label="Label" />
    </FormGroup>
  );
};

const TextboxComponent = (data) => {
  return (
    <FormControl variant="standard">
      <InputLabel shrink htmlFor="bootstrap-input">
        Bootstrap
      </InputLabel>
      <TextField defaultValue="react-bootstrap" id="bootstrap-input" />
    </FormControl>
  );
};

const RadioButtonComponent = (data) => {
  return (
    <FormControl>
      <FormLabel id="">Gender</FormLabel>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="female"
        name="radio-buttons-group">
        <FormControlLabel value="female" control={<Radio />} label="Female" />
        <FormControlLabel value="male" control={<Radio />} label="Male" />
        <FormControlLabel value="other" control={<Radio />} label="Other" />
      </RadioGroup>
    </FormControl>
  );
};

export default ViewForm;
