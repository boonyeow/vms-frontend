import {
  Autocomplete,
  Button,
  Checkbox,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useState } from "react";

const AttachedFormsSection = ({
  formOptions,
  attachedForms,
  setAttachedForms,
  disabled,
}) => {
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const swapSequence = (from, to) => {
    let newSequence = [...attachedForms];
    newSequence[from] = attachedForms[to];
    newSequence[to] = attachedForms[from];
    setAttachedForms(newSequence);
  };

  const handleChange = (event, newValue) => {
    console.log("hnewu value", newValue);
    setAttachedForms(newValue);
  };

  return (
    <>
      <Box sx={{ py: 2 }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ color: "action.main", alignSelf: "center" }}>
          Attached Forms
        </Typography>

        <Box sx={{ my: 2 }}>
          <Autocomplete
            disabled={disabled}
            multiple
            id="checkboxes-tags-demo"
            options={formOptions}
            disableCloseOnSelect
            getOptionLabel={(option) =>
              `${option.name} (id=${option.id.id}, revNo=${option.id.revisionNo})`
            }
            onChange={handleChange}
            value={attachedForms}
            isOptionEqualToValue={(option, value) =>
              option.id.id === value.id.id &&
              option.id.revisionNo === value.id.revisionNo
            }
            //   option.<property> to compare
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {`${option.name} (id=${option.id.id}, revNo=${option.id.revisionNo})`}
              </li>
            )}
            style={{ width: "100%", background: "white" }}
            renderInput={(params) => (
              <TextField {...params} placeholder="Add a new form to workflow" />
            )}
          />
        </Box>
        <Typography
          fontWeight="bold"
          sx={{ color: "action.light", alignSelf: "center" }}>
          Approval Sequence
        </Typography>

        {attachedForms.map((i) => {
          return (
            <Box
              key={attachedForms.indexOf(i)}
              sx={{
                bgcolor: "white",
                p: 3,
                borderRadius: 2,
                my: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
              <Typography sx={{ fontWeight: "bold" }}>
                {attachedForms.indexOf(i) + 1}.{" "}
                {`${i.name} (id=${i.id.id}, revNo=${i.id.revisionNo})`}
              </Typography>
              <Box>
                <Button
                  variant="outlined"
                  disabled={
                    attachedForms.length == 1 || attachedForms.indexOf(i) == 0
                      ? true
                      : false
                  }
                  onClick={() => {
                    swapSequence(
                      attachedForms.indexOf(i),
                      attachedForms.indexOf(i) - 1
                    );
                  }}
                  sx={{ mr: 2 }}>
                  Shift up
                </Button>
                <Button
                  variant="outlined"
                  disabled={
                    attachedForms.length == 1 ||
                    attachedForms.indexOf(i) == attachedForms.length - 1
                      ? true
                      : false
                  }
                  onClick={() => {
                    swapSequence(
                      attachedForms.indexOf(i),
                      attachedForms.indexOf(i) + 1
                    );
                  }}>
                  Shift down
                </Button>
              </Box>
            </Box>
          );
        })}
      </Box>
    </>
  );
};

export default AttachedFormsSection;
