import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";

const RadioButtonComponentV2 = ({
  idx,
  fieldData,
  fieldResponses,
  setFieldResponses,
  show,
  isParent,
  displayMap,
  setDisplayMap,
  fetchFieldMap,
}) => {
  const options = Object.entries(fieldData.options);
  const optionNames = options.map(([name]) => name);
  const [selectedOption, setSelectedOption] = useState(
    Array(options.length).fill(false)
  );

  const handleChange = (e) => {
    let prevOptionIndex = selectedOption.indexOf(true);
    let optionIndex = e.target.name;
    let updatedSelectedOption = [...selectedOption];
    updatedSelectedOption[prevOptionIndex] = false;
    updatedSelectedOption[optionIndex] = true;
    setSelectedOption(updatedSelectedOption);

    const newValue = {
      type: "radiobutton",
      name: optionNames,
      ans: updatedSelectedOption,
    };
    let temp = { ...fieldResponses };
    temp[fieldData.id] = JSON.stringify(newValue);
    setFieldResponses(temp);

    let previousFieldId = fieldData["options"][optionNames[prevOptionIndex]];
    let nextFieldId = fieldData["options"][optionNames[optionIndex]];
    let tempDisplayMap = { ...displayMap };
    tempDisplayMap[previousFieldId] = false;
    tempDisplayMap[nextFieldId] = true;
    setDisplayMap(tempDisplayMap);
  };

  let displayStyle = show ? "block" : "none";
  return (
    <Box sx={{ display: displayStyle }}>
      <FormControl>
        <FormLabel id="demo-radio-buttons-group-label">
          {isParent ? `${idx + "."} ${fieldData.name}` : fieldData.name}
        </FormLabel>
        <RadioGroup name="radio-buttons-group" onChange={handleChange}>
          {options.map(([name], index) => (
            <FormControlLabel
              key={index}
              value={name}
              control={<Radio name={index} disabled={!show} />}
              label={name}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default RadioButtonComponentV2;
