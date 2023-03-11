import NavBar from "../../components/SharedComponents/NavBar";
import RadioButtonInput from "../../components/FormInputs/RadioButtonInput";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import Menu from "@mui/material/Menu";

const FormCreation = () => {

  const [inputTypes, setInputTypes] = useState([
    { name: "Radiobutton", value: 0 },
    { name: "CheckBox", value: 1 },
    { name: "TextField", value: 2 },
    { name: "TextArea", value: 3 },
    // can add more options
  ]);
  const handleAddInput = () => {

  };
  const [sections, setSections] = useState([]);
  const handleAddSection = () => {
    const newSection = {};
    setSections([...sections,newSection])
  }
    const handleDeleteSection = (index) => {
      const newSection = sections.filter((_, i) => i !== index);
      setSections(newSection);
    };
  return (
    <>
      <NavBar />
      <h1>Form Creation</h1>
      <Card sx={{ maxWidth: 900, margin: "auto" }}>
        <CardContent>
          <Stack spacing={2}>
            <TextField
              id="outlined-basic"
              label="Form Title"
              variant="standard"
            />

            <TextField
              id="standard-multiline-flexible"
              label="Description"
              multiline
              rows={4}
              variant="outlined"
            />
          </Stack>
          {sections.map((section, index) => (
            <Card
              sx={{ maxWidth: 900, margin: "auto", marginTop: 2 }}
              key={index}
            >
              <CardContent>
                <Stack spacing={2} alignItems="flex-start">
                  <TextField
                    id="outlined-basic"
                    label={`Question ${index + 1}`}
                    variant="standard"
                  />
                  <Box sx={{ flexGrow: 0 }} key={index}>
                    <PopupState variant="popover" popupId="demo-popup-menu">
                      {(popupState) => (
                        <React.Fragment>
                          <IconButton {...bindTrigger(popupState)}>
                            <AddCircleIcon />
                          </IconButton>
                          <Menu {...bindMenu(popupState)}>
                            {inputTypes.map((input, index) =>
                              <MenuItem onClick={() => { popupState.close(); handleAddInput(input.name); }}>
                              <Typography textAlign="center">{input.name}</Typography>
                            </MenuItem>
                            )}
                          </Menu>
                        </React.Fragment>
                      )}
                    </PopupState>
                  </Box>
                </Stack>
              </CardContent>
              <CardActions>
                <IconButton
                  sx={{ marginLeft: "auto" }}
                  onClick={() => handleDeleteSection(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => handleAddSection()}>
            Add Section
          </Button>
        </CardActions>
      </Card>

      {/* <Button variant="contained">Add RadioButtons</Button>
      <RadioButtonInput /> */}
    </>
  );
};
export default FormCreation;
