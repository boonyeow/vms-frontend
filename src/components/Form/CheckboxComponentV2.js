import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";

const CheckboxComponentV2 = ({
  idx,
  fieldData,
  fieldResponses,
  setFieldResponses,
  show,
  isParent,
  initialResponses,
}) => {
  const options = Object.entries(fieldData.options);
  const optionNames = options.map(([name]) => name);
  const [selectedOptions, setSelectedOptions] = useState(
    Array(options.length).fill(false)
  );

  useEffect(() => {
    if (
      fieldData !== undefined &&
      Object.keys(fieldData).length !== 0 &&
      initialResponses !== undefined &&
      Object.keys(initialResponses).length !== 0
    ) {
      let temp = JSON.parse(initialResponses[fieldData.id]);
      setSelectedOptions(temp.ans);
    }
  }, [fieldData, initialResponses]);

  const handleChange = (optionIndex, checked) => {
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions[optionIndex] = checked;
    setSelectedOptions(updatedSelectedOptions);
    console.log("heheheupdated", updatedSelectedOptions);
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
                  checked={selectedOptions[index]}
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
