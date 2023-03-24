import {
  Stack,
  Button,
  IconButton,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  FormGroup,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
} from "@mui/material";
import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import RequiredCheckBox from "./RequiredCheckBox";
export default function Fields({ field, index }) {
  const [selectedValue, setSelectedValue] = useState("a");
  const [text, setText] = useState();

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
    const textChange = (value, key) => {

}
  console.log(field);
  if (field.fieldType === "radio") {
    return (
      <>
        {Object.entries(field.options).map(([key, value], j) => (
          <Stack direction="row" justifyContent="flex-start">
            <Radio
              checked={selectedValue === "a"}
              onChange={handleChange}
              value="a"
              name="radio-buttons"
              inputProps={{ "aria-label": "A" }}
            />
                <TextField value={key} onBlur={ (e)=>textChange(e.target.value,key)} variant="standard" />

            {/* <Stack direction="row">
          <Radio
            checked={selectedValue === "b"}
            onChange={handleChange}
            value="b"
            name="radio-buttons"
            inputProps={{ "aria-label": "B" }}
          />
          <TextField variant="standard" />
        </Stack> */}
          </Stack>
        ))}
        <Stack>
          <Button onClick={()=>addOption(index)}> Add Option</Button>
        </Stack>
      </>
    );
  } else if (field.fieldType === "check") {
    return <></>;
  } else {
    return <></>;
  }
}
