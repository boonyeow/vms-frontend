import {
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";

export default function RequiredCheckBox({ nextField, value, index, fieldDataChange,j }) {
  return (
    <>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={value}
              onChange={(e) =>
                fieldDataChange(e.target.checked, index, nextField, 'isRequired',j)
              }
            />
          }
          label="Required"
        />
      </FormGroup>
    </>
  );
}
