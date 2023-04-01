import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";

const CheckboxComponentV2 = ({
  idx,
  fieldData,
  fieldResponses,
  setFieldResponses,
  show,
  isParent,
}) => {
  const options = Object.entries(fieldData.options);
  const optionNames = options.map(([name]) => name);
  const [selectedOptions, setSelectedOptions] = useState(
    Array(options.length).fill(false)
  );
  const handleChange = (optionIndex, checked) => {
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions[optionIndex] = checked;
    setSelectedOptions(updatedSelectedOptions);
    const newValue = {
      type: "checkbox",
      name: optionNames,
      ans: updatedSelectedOptions,
    };

    let temp = { ...fieldResponses };
    temp[fieldData.id] = JSON.stringify(newValue);
    setFieldResponses(temp);
  };
  let displayStyle = show ? "block" : "none";
  return (
    <Box sx={{ display: displayStyle }}>
      <FormGroup>
        <FormLabel>
          {isParent ? `${idx + "."} ${fieldData.name}` : fieldData.name}
        </FormLabel>
        {options.map(([name], index) => (
          <>
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
          </>
        ))}
      </FormGroup>
    </Box>
  );
};

export default CheckboxComponentV2;
