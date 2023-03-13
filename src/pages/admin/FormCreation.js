import NavBar from "../../components/SharedComponents/NavBar";
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
import EditIcon from "@mui/icons-material/Edit";
import FormControlLabel from "@mui/material/FormControlLabel";
import CloseIcon from "@mui/icons-material/Close";
import ShortTextIcon from "@mui/icons-material/ShortText";
import Grid from "@mui/material/Grid";
import Checkbox from '@mui/material/Checkbox';


// import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { TimePicker } from "@mui/x-date-pickers/TimePicker";
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";

const FormCreation = () => {
  const handleRequired = (index) => {
  const newSections = [...sections];
   newSections[index].required = !newSections[index].required;
    setSections(newSections);
    console.log(newSections)
}
  const [inputTypes, setInputTypes] = useState([
    { name: "Radiobutton", value: "radio" },
    { name: "CheckBox", value: "checkbox" },
    { name: "TextField", value: "text" }
    // can add more options
  ]);
  const handleAddInput = (index, inputType) => {
    const newSections = [...sections];
    newSections[index].inputType = inputType;
    if (inputType.value == 'text') {
      newSections[index].options[0].optionText = '';
    }
    console.log(newSections)
    setSections(newSections);
  };
  const [sections, setSections] = useState([]);
  const changeQuestion = (text,i) => {
    let newQuestion = [...sections];
    newQuestion[i].questionText = text;
    setSections(newQuestion)

  }
  const handleAddSection = () => {
    const newSection = {
      questionText: "Question",
      inputType: { name: "Radiobutton", value: "radio" },
      options: [{ optionText: "option" }],
      required:false
    };
    setSections([...sections, newSection])
  }
  const handleDeleteSection = (index) => {
      const newSection = sections.filter((_, i) => i !== index);
      setSections(newSection);
  };
  const handleDeleteOption = (sectionNo, optionNo) => {
    const newSections = [...sections];
    if (newSections[sectionNo].options.length > 1) {
      newSections[sectionNo].options.splice(optionNo, 1);
      setSections(newSections)
    }
    // newSections[sectionNo].options.splice(optionNo, 1)
  };
  const changeOptionValue = (text, index,j) => {
    let newSections = [...sections];
    newSections[index].options[j].optionText = text;
    setSections(newSections)
  }

  const handleAddOption = (index) => {
    const newSections = [...sections];
    if (newSections[index].options.length < 10) {
      newSections[index].options.push({ optionText: "option" });
    } else {
      console.log("max 10 options")
    }
    setSections(newSections)
  }

  return (
    <>
      <NavBar />
      <h1>Form Creation</h1>
      <Card sx={{ maxWidth: 900, margin: "auto" }}>
        <CardContent>
          <Stack spacing={2} direction="row">
            <TextField id="outlined-basic" label="Form ID" variant="standard" />

            <TextField
              id="outlined-basic"
              label="Revision #"
              variant="standard"
            />

            <TextField
              id="outlined-basic"
              label="Effective Date"
              variant="standard"
            />
          </Stack>
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
                <Stack spacing={2}>
                  <Stack
                    spacing={2}
                    direction="row"
                    justifyContent="space-between"
                  >
                    <TextField
                      id="outlined-basic"
                      value={section.questionText}
                      label={`Question ${index + 1}`}
                      variant="standard"
                      onChange={(e) => changeQuestion(e.target.value, index)}
                    />
                    <Box sx={{ flexGrow: 0 }} key={index}>
                      <PopupState variant="popover" popupId="demo-popup-menu">
                        {(popupState) => (
                          <React.Fragment>
                            {!section.inputType ? (
                              <IconButton {...bindTrigger(popupState)}>
                                <AddCircleIcon />
                              </IconButton>
                            ) : (
                              <IconButton {...bindTrigger(popupState)}>
                                <EditIcon />
                              </IconButton>
                            )}
                            <Menu {...bindMenu(popupState)}>
                              {inputTypes.map(
                                (input, k) =>
                                  section.inputType !== input.name && (
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close();
                                        handleAddInput(index, input);
                                      }}
                                      key={`${index}-${k}`}
                                    >
                                      <Typography textAlign="center">
                                        {input.name}
                                      </Typography>
                                    </MenuItem>
                                  )
                              )}
                            </Menu>
                          </React.Fragment>
                        )}
                      </PopupState>
                    </Box>
                  </Stack>
                  {section.options.map((op, j) => (
                    <>
                      <Grid
                        container
                        justifyContent="flex-start"
                        alignItems="center"
                      >
                        {section.inputType.value !== "text" ? (
                          <>
                            <Grid item xs={1}>
                              <input
                                type={section.inputType.value}
                                value={op.optionText}
                                name={
                                  section.inputType.value === "radio"
                                    ? index
                                    : `${index}-${j}`
                                }
                              />
                            </Grid>
                            <Grid item xs={3}>
                              <input
                                type="text"
                                placeholder={
                                  section.inputType.value === "text"
                                    ? ""
                                    : "option"
                                }
                                value={op.optionText}
                                onChange={(e) => {
                                  changeOptionValue(e.target.value, index, j);
                                }}
                              />
                            </Grid>
                          </>
                        ) : (
                          <>
                            <Grid item xs={1}>
                              <ShortTextIcon />
                            </Grid>
                            <Grid item xs={11}>
                              <TextField
                                variant="outlined"
                                value={op.optionText}
                                onChange={(e) => {
                                  changeOptionValue(e.target.value, index, j);
                                }}
                                sx={{ minWidth: "80%" }}
                              />
                            </Grid>
                          </>
                        )}
                        {/* label=
                        {section.inputType.value === "text" ? (
                          ""
                        ) : (
                          <Typography>{op.optionText}</Typography>
                        )} */}

                        {j == 0 ? (
                          ""
                        ) : (
                          <Grid item xs={1}>
                            <IconButton
                              aria-label="delete"
                              onClick={() => handleDeleteOption(index, j)}
                            >
                              <CloseIcon />
                            </IconButton>
                          </Grid>
                        )}
                      </Grid>
                    </>
                  ))}

                  {section.inputType.value !== "text" ? (
                    <Stack alignItems="flex-start">
                      <Button
                        variant="text"
                        color="primary"
                        onClick={() => handleAddOption(index)}
                      >
                        Add Option
                      </Button>
                    </Stack>
                  ) : (
                    ""
                  )}

                  {/* {section.inputType === "Radiobutton" && <RadioButtonInput />} */}
                </Stack>
              </CardContent>
              <CardActions>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                  }}
                >
                  <FormControlLabel
                    onChange={() => handleRequired(index)}
                    control={<Checkbox />}
                    label="Required"
                  />
                  <IconButton onClick={() => handleDeleteSection(index)}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              </CardActions>
            </Card>
          ))}
        </CardContent>
        <CardActions>
          <Button size="small" onClick={handleAddSection}>
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
