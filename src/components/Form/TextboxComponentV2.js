import { InputLabel, TextField, Typography } from "@mui/material";
import { useState } from "react";

const TextboxComponentV2 = ({
  fieldData,
  idx,
  regexMap,
  fieldResponses,
  setFieldResponses,
}) => {
  const [inputError, setInputError] = useState("");
  const handleInputChange = (e) => {
    if (fieldData.regexId) {
      const newValue = e.target.value;
      const regex = new RegExp(regexMap[fieldData.regexId].pattern);
      const isValid = regex.test(newValue);
      console.log("isval", regexMap[fieldData.regexId]);
      if (!isValid && newValue !== "") {
        setInputError(
          `Please enter a correct ${regexMap[fieldData.regexId].name} format`
        );
        return;
      } else {
        setInputError("");
        let temp = { ...fieldResponses };
        temp[fieldData.id] = newValue;
        setFieldResponses(temp);
      }
    }
  };
  return (
    <>
      <InputLabel>
        {`${idx + 1}. `} {fieldData.name}
      </InputLabel>
      <TextField
        sx={{ mt: 1 }}
        variant="outlined"
        size="small"
        required={fieldData.isRequired}
        helperText={inputError}
        error={!!inputError}
        onChange={handleInputChange}></TextField>
      <Typography variant="caption">{fieldData.helpText}</Typography>
    </>
  );
};

export default TextboxComponentV2;
