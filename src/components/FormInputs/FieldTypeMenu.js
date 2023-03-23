import React from "react";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

const FieldTypeMenu = ({ handleChangeFieldType, index, isNextField }) => {
      const inputTypes=[
        { name: "Radiobutton", value: "radio" },
        { name: "CheckBox", value: "checkbox" },
        { name: "TextField", value: "text" },
        // can add more options
      ];
  return (
    <Box sx={{ flexGrow: 0 }}>
      <PopupState variant="popover" popupId="demo-popup-menu">
        {(popupState) => (
          <React.Fragment>
            <IconButton {...bindTrigger(popupState)}>
              {isNextField ? <AddIcon /> : <EditIcon />}
            </IconButton>

            <Menu {...bindMenu(popupState)}>
              {inputTypes.map((input, k) => (
                <MenuItem
                  onClick={() => {
                    popupState.close();
                    handleChangeFieldType(index, input, isNextField);
                  }}
                  key={`${k}`}
                >
                  <Typography textAlign="center">{input.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </React.Fragment>
        )}
      </PopupState>
    </Box>
  );
};

export default FieldTypeMenu;
