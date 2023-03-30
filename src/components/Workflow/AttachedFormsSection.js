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
  attachedForms = [],
  setAttachedForms,
  userList = [],
  userMap,
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

  const handleAttachForm = (event, newValue) => {
    let temp = [];
    for (let i = 0; i < newValue.length; i++) {
      temp.push({
        account: null,
        form: newValue[i]["id"],
      });
    }
    console.log("new Valee", newValue);
    setAttachedForms(newValue);
  };

  const handleAssignUser = (newValue, idx) => {
    let temp = [...attachedForms];
    temp[idx]["account"] = newValue;
    setAttachedForms(temp);
    console.log("COMONMAN", temp);
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
            onChange={handleAttachForm}
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

        {attachedForms &&
          attachedForms.map((i) => {
            return (
              <Box
                key={attachedForms.indexOf(i)}
                sx={{ bgcolor: "white", borderRadius: 2, py: 3, my: 2 }}>
                <Box
                  sx={{
                    px: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {attachedForms.indexOf(i) + 1}.{" "}
                    {`${i.name} (id=${i.id.id}, revNo=${i.id.revisionNo})`}
                  </Typography>
                  <Box>
                    <Button
                      variant="outlined"
                      disabled={
                        attachedForms.length == 1 ||
                        attachedForms.indexOf(i) == 0
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
                <Box sx={{ px: 3, py: 2 }}>
                  <Typography
                    sx={{ color: "action.light", fontWeight: "bold" }}>
                    Assign to User
                  </Typography>

                  <Box sx={{ mt: 1 }}>
                    {/* {console.log(i.hasOwnProperty("id"))}
                    {console.log(i)} */}
                    {i.hasOwnProperty("id") && (
                      <Autocomplete
                        defaultValue={
                          userList[userList.findIndex((x) => x.id === i.id)]
                        }
                        onChange={(event, newValue) => {
                          handleAssignUser(newValue, attachedForms.indexOf(i));
                        }}
                        id="controllable-states-demo"
                        options={userList}
                        getOptionLabel={(option) => option["email"]}
                        sx={{ width: 300, bgcolor: "white", mr: 2 }}
                        renderInput={(params) => (
                          <TextField {...params} label="Search User" />
                        )}
                        size="small"
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            );
          })}
      </Box>
    </>
  );
};

export default AttachedFormsSection;
