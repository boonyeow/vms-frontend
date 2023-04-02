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
  displayMap,
  setDisplayMap,
  initialResponses,
  isSubmission,
}) => {
  const options = Object.entries(fieldData.options);
  const optionNames = options.map(([name]) => name);
  const [selectedOptions, setSelectedOptions] = useState(
    Array(options.length).fill(false)
  );

  useEffect(() => {
    console.log(initialResponses);
    if (
      fieldData !== undefined &&
      Object.keys(fieldData).length !== 0 &&
      initialResponses !== undefined &&
      Object.keys(initialResponses).length !== 0 &&
      initialResponses.hasOwnProperty(fieldData.id)
    ) {
      let temp = JSON.parse(initialResponses[fieldData.id]);
      let tempValue = temp.name.find((name, idx) => temp.ans[idx]);
      let nextFieldId = fieldData["options"][tempValue];
       if (isParent) {
         let tempDisplayMap = { ...displayMap };
         tempDisplayMap[nextFieldId] = true;
         setDisplayMap(tempDisplayMap);
         console.log(tempDisplayMap);
       }
      setSelectedOptions(temp.ans);
    }
  }, [fieldData, initialResponses]);

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

     let curOptionIndex = updatedSelectedOptions.reduce((acc, cur, index) => {
       if (cur) {
         acc.push(index);
       }
       return acc;
     }, []);
    let unchecked = updatedSelectedOptions.reduce((acc, cur, index) => {
      if (!cur) {
        acc.push(index);
      }
      return acc;
    }, []);

    let nextFieldId = curOptionIndex.map(
      (id) => fieldData["options"][optionNames[id]]
    );
    let remove = unchecked.map(
      (id) => fieldData["options"][optionNames[id]]
    );
    let tempDisplayMap = { ...displayMap };
    for (let id of remove) {
      tempDisplayMap[id] = false;
    }
    for (let id of nextFieldId) {
      tempDisplayMap[id] = true;
    }
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
       console.log(tempDisplayMap);
       setDisplayMap(tempDisplayMap);
     }
  };
  let displayStyle = show ? "block" : "none";
  return (
    <Box sx={{ display: displayStyle }}>
      <FormGroup>
        <FormLabel>
          {isParent ? `${idx + "."} ${fieldData.name}` : fieldData.name}
        </FormLabel>
        {isSubmission
          ? options.map(([name], index) => (
              <>
                <FormControlLabel
                  key={name}
                  control={
                    <Checkbox
                      required={fieldData.isRequired}
                      inputProps={{ "aria-label": name }}
                      checked={selectedOptions[index]}
                      disabled={true}
                      onChange={(e) => handleChange(index, e.target.checked)}
                    />
                  }
                  label={name}
                />
              </>
            ))
          : options.map(([name], index) => (
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
