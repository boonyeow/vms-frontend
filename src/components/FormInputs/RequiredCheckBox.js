import {
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";

export default function RequiredCheckBox({ field, nextField, value, index, fieldDataChange }) {
  return (
    <>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={value}
              onChange={(e) =>
                fieldDataChange(e.target.checked, index, nextField, 'isRequired')
              }
            />
          }
          label="Required"
        />
      </FormGroup>
    </>
  );
}
