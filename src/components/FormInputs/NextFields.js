import {
  Stack,
  Button,
  IconButton,
  Checkbox,
    FormControlLabel,
    Grid,
  TextField,
FormGroup} from "@mui/material";
import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import RequiredCheckBox from "./RequiredCheckBox";
export default function NextFields({
  field,
  index,
  nextFieldOptionChange,
  addNextFieldOptions,
  deleteNextFieldOptions,
}) {
  const [optionValue, setOptionValue] = useState(["option 1"]);
  useEffect(() => {}, []);
  const addOptionValue = () => {
    const newOptions = [...optionValue];
    newOptions.push(`option ${newOptions.length + 1}`);
    setOptionValue(newOptions);
  };
  const onDelete = (j) => {
    const newOptions = [...optionValue];
    newOptions.slice(j, 1);
    setOptionValue(newOptions);
  };

  if (
    field.optionsWithNextFields[field.name].fieldType !== "text" &&
    Object.keys(field.optionsWithNextFields[field.name].optionsWithNextFields)
      .length !== 0
  ) {
    return (
      <>
        {Object.entries(
          field.optionsWithNextFields[field.name].optionsWithNextFields
        ).map(([key, value], j) => (
          <Stack direction="row" sx={{ paddingY: 1 }} key={key}>
            <input
              type={
                field.optionsWithNextFields[field.name].fieldType === "radio"
                  ? "radio"
                  : field.optionsWithNextFields[field.name].fieldType
              }
              name={
                field.optionsWithNextFields[field.name].fieldType === "radio"
                  ? "nextFieldRadioGroup"
                  : key
              }
            />
            <input
              className="option-text"
              type="text"
              value={optionValue[j]}
              onBlur={(e) => {
                nextFieldOptionChange(e.target.value, key, index);
              }}
              onChange={(e) => {
                const newOptions = [...optionValue];
                newOptions[j] = e.target.value;
                setOptionValue(newOptions);
              }}
            />
            <IconButton
              onClick={() => {
                onDelete(j);
                deleteNextFieldOptions(index, key, false);
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        ))}
        {field.optionsWithNextFields[field.name].fieldType !== "text" && (
          <>
            <Button
              variant="text"
              color="secondary"
              onClick={async () => {
                addOptionValue();
                await addNextFieldOptions(index);
              }}
                sx={{ paddingX: 0 }}
            >
              Add Option
            </Button>
          </>
        )}

      </>
    );
  } else if (Object.keys(field.optionsWithNextFields).length !== 0) {
      return (
        <Grid container direction="row">
          <Grid item xs={10}>
            <TextField
              fullWidth
              variant="outlined"
              key={field.name}
              size="small"
              placeholder="User Input"
           />
          </Grid>
          <Grid item xs={2}>
            <IconButton
              onClick={() => {
                deleteNextFieldOptions(index, null, true);
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Grid>
        </Grid>
      );
  }
}
