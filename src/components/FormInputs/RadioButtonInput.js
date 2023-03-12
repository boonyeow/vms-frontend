// import React, { useState } from "react";
// import {
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   Button,
//   TextField,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import IconButton from "@mui/material/IconButton";

// RadioButtonInput.defaultProps = {
//   value: "2",
//   onChange: () => console.log("default onChange function"),
// };


// function RadioButtonInput() {

//   const [value, setValue] = useState("option1");
//   const handleChange = (event) => {
//     setValue(event.target.value);
//   };
//   const [options, setOptions] = useState([
//     { value: "option1", label: "Option 1", editing: true },
//     { value: "option2", label: "Option 2", editing: true },
//   ]);
//   const [label, setLabel] = useState("");


//   const handleAddOption = () => {
//     const newOption = {
//       label: `Option ${options.length + 1}`,
//       value: `option_${options.length + 1}`,
//       editing: true,
//     };
//     setOptions([...options, newOption]);
//   };
//   const handleDeleteClick = (index) => {
//     const newOptions = options.filter((option, i) => i !== index);
//     setOptions(newOptions);
//   };

//   const handleOptionChange = (index, key) => (event) => {
//     const newOptions = [...options];
//     newOptions[index][key] = event.target.value;
//     setOptions(newOptions);
//   };

//   const handleOptionEdit = (index, key) => () => {
//     const newOptions = [...options];
//     newOptions[index].editing = true;
//     setOptions(newOptions);
//   };

//   return (
//     <div>
//       <RadioGroup value={value} onChange={handleChange}>
//         {options.map((option, index) => (
//           <FormControlLabel
//             key={index}
//             value={option.value}
//             control={<Radio />}
//             label={
//               option.editing ? (
//                 <>
//                   <TextField
//                     value={option.label}
//                     onChange={handleOptionChange(index, "label")}
//                   />
//                   {index === 0 ? null : (
//                     <IconButton
//                       onClick={() => handleDeleteClick(index)}
//                       aria-label="delete"
//                     >
//                       <CloseIcon />
//                     </IconButton>
//                   )}
//                 </>
//               ) : (
//                 option.label
//               )
//             }
//             onClick={() => handleOptionEdit(index, "label")}
//           />
//         ))}
//       </RadioGroup>
//       <Button
//         variant="contained"
//         color="primary"
//         onClick={() => handleAddOption()}
//       >
//         Add Option
//       </Button>
//     </div>
//   );
// }

// export default RadioButtonInput;
