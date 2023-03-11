import React, { useState } from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  TextField,
} from "@mui/material";
import PropTypes from "prop-types";

RadioButtonInput.defaultProps = {
  value: "2",
  onChange: () => console.log("default onChange function"),
  onOptionsChange: () => console.log("default onOptionChange function"),
};

RadioButtonInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onOptionsChange: PropTypes.func,
};

function RadioButtonInput(props) {
  const [options, setOptions] = useState([
    { value: "option1", label: "Option 1", editing: true },
    { value: "option2", label: "Option 2", editing: true },
  ]);
  const [label, setLabel] = useState("");
  const { value, onChange, onOptionsChange } = props;


  const handleAddOption = () => {
    const newOption = {
      label: `Option ${options.length + 1}`,
      value: `option_${options.length + 1}`,
      editing: true,
    };
    setOptions([...options, newOption]);
  };

  const handleOptionChange = (index, key) => (event) => {
    const newOptions = [...options];
    newOptions[index][key] = event.target.value;
   setOptions(newOptions);
  };

  const handleOptionEdit = (index, key) => () => {
    const newOptions =[...options];
    newOptions[index].editing = true;
   setOptions(newOptions);
  };

  return (
    <div>
      <TextField
        variant="standard"
        value={label}
        onChange={(event) => setLabel(event.target.value)}
        label="Question"
      />
      <RadioGroup value={value} onChange={onChange}>
        {options.map((option, index) => (
          <FormControlLabel
            key={index}
            value={option.value}
            control={<Radio />}
            label={
              option.editing ? (
                <TextField
                  value={option.label}
                  onChange={handleOptionChange(index, "label")}
                />
              ) : (
                option.label
              )
            }
            onClick={handleOptionEdit(index, "label")}
          />
        ))}
        {/* {extraOptions.map((option, index) => (
          <FormControlLabel
            key={index}
            value={option.value}
            control={<Radio />}
            label={
              option.editing ? (
                <TextField
                  value={option.label}
                  onChange={handleOptionChange(index, "label")}
                />
              ) : (
                option.label
              )
            }
            onClick={handleOptionEdit(index, "extra")}
          />
        ))} */}
      </RadioGroup>
      <Button variant="contained" color="primary" onClick={handleAddOption}>
        Add Option
      </Button>
    </div>
  );
}

export default RadioButtonInput;
