import React from "react";
import { TextField } from "@material-ui/core";

function TextFieldInput(props) {
  const { label, value, onChange } = props;

  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      variant="outlined"
      margin="normal"
      fullWidth
    />
  );
}

export default TextFieldInput;
