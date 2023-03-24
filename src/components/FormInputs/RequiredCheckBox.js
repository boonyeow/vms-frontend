import {
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";

export default function RequiredCheckBox({ field, nextField, index, fieldDataChange }) {
  return (
    <>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
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
