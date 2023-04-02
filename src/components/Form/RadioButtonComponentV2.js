import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";

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
  initialResponses,
  isSubmission,
}) => {
  const options = Object.entries(fieldData.options);
  const optionNames = options.map(([name]) => name);
  const [selectedOption, setSelectedOption] = useState(
    Array(options.length).fill(false)
  );
  const [value, setValue] = useState("");

  useEffect(() => {
    if (
      fieldData !== undefined &&
      Object.keys(fieldData).length !== 0 &&
      initialResponses !== undefined &&
      Object.keys(initialResponses).length !== 0 &&
      initialResponses.hasOwnProperty(fieldData.id)
    ) {
      let temp = JSON.parse(initialResponses[fieldData.id]);
      let tempValue = temp.name.find((name, idx) => temp.ans[idx]);
      setValue(tempValue);
      let nextFieldId = fieldData["options"][tempValue];

      if (isParent) {
        let tempDisplayMap = { ...displayMap };
        tempDisplayMap[nextFieldId] = true;
        setDisplayMap(tempDisplayMap);
      }
    }
  }, [fieldData, initialResponses]);

  const handleChange = (e) => {
    setValue(e.target.value);
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

    if (
      initialResponses !== undefined &&
      Object.keys(initialResponses).length !== 0
    ) {
      let temp = JSON.parse(initialResponses[fieldData.id]);
      let tempValue = temp.name.find((name, idx) => temp.ans[idx]);
      let initialNextFieldId = fieldData["options"][tempValue];

      if (nextFieldId !== initialNextFieldId) {
        tempDisplayMap[initialNextFieldId] = false;
      }
    }

    if (isParent) {
      setDisplayMap(tempDisplayMap);
    }
  };

  let displayStyle = show ? "block" : "none";
  return (
    <Box sx={{ display: displayStyle }}>
      <FormControl>
        <FormLabel id="demo-radio-buttons-group-label">
          {isParent ? `${idx + "."} ${fieldData.name}` : fieldData.name}
        </FormLabel>
        {isSubmission ? (
          <RadioGroup
            name="radio-buttons-group"
            onChange={handleChange}
            value={value}>
            {options.map(([name], index) => (
              <FormControlLabel
                key={index}
                value={name}
                control={<Radio name={index} disabled={true} />}
                label={name}
              />
            ))}
          </RadioGroup>
        ) : (
          <RadioGroup
            name="radio-buttons-group"
            onChange={handleChange}
            value={value}>
            {options.map(([name], index) => (
              <FormControlLabel
                key={index}
                value={name}
                control={<Radio name={index} disabled={!show} />}
                label={name}
              />
            ))}
          </RadioGroup>
        )}
      </FormControl>
    </Box>
  );
};

export default RadioButtonComponentV2;
