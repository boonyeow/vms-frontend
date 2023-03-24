import { Checkbox, TextBox, FormGroup } from "@mui/material";

export default function HelpTextInput({
  field,
  nextField,
  index,
  handleIsRequiredChange,
}) {
  return (
    <>
      <TextField
        size="small"
        variant="standard"
        inputProps={{ style: { fontSize: 12 } }}
        InputLabelProps={{ style: { fontSize: 12 } }}
        label="Help Text (optional)"
      />
    </>
  );
}
