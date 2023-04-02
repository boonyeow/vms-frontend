import { InputLabel, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";

const TextboxComponentV2 = ({
  fieldData,
  idx,
  regexMap,
  fieldResponses,
  setFieldResponses,
  show,
  isParent,
  initialResponses,
  isSubmission,
}) => {
  const [inputError, setInputError] = useState("");
  const [value, setValue] = useState();

  useState(() => {
    if (
      fieldData !== undefined &&
      Object.keys(fieldData).length !== 0 &&
      initialResponses !== undefined &&
      Object.keys(initialResponses).length !== 0
    ) {
      setValue(initialResponses[fieldData.id]);
    }
  }, []);

  const handleInputChange = (e) => {
    if (fieldData.regexId) {
      const newValue = e.target.value;
      const regex = new RegExp(regexMap[fieldData.regexId].pattern);
      const isValid = regex.test(newValue);
      if (!isValid && newValue !== "") {
        setInputError(
          `Please enter a correct ${regexMap[fieldData.regexId].name} format`
        );
      } else {
        setInputError("");
        let temp = { ...fieldResponses };
        temp[fieldData.id] = newValue;
        setFieldResponses(temp);
      }
    }
  };

  let displayStyle = show ? "block" : "none";
  return (
    <>
      <Box sx={{ display: displayStyle }}>
        <InputLabel>
          {isParent ? `${idx + "."} ${fieldData.name}` : fieldData.name}
        </InputLabel>
        {isSubmission ? (
          <TextField
            sx={{ mt: 1, width: "100%" }}
            variant="outlined"
            size="small"
            required={fieldData.isRequired}
            helperText={inputError}
            error={!!inputError}
            onChange={handleInputChange}
            defaultValue={value}
            disabled={true}></TextField>
        ) : (
          <TextField
            sx={{ mt: 1, width: "100%" }}
            variant="outlined"
            size="small"
            required={fieldData.isRequired}
            helperText={inputError}
            error={!!inputError}
            onChange={handleInputChange}
            defaultValue={value}
            disabled={!show}></TextField>
        )}
      </Box>
    </>
  );
};

export default TextboxComponentV2;
