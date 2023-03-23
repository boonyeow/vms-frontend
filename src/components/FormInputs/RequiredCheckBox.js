import {
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";

export default function RequiredCheckBox({field,nextField, index, handleIsRequiredChange}) {

  return (
    <>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              onChange={(e) =>
                handleIsRequiredChange(e.target.checked, nextField,index)
              }
            />
          }
          label="Required"
        />
      </FormGroup>
    </>
  );
}
