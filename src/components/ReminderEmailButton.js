import axios from "axios";
import { useAuthStore } from "../store";
import { useState } from "react";
import { Box, Button, Typography, Modal, TextField } from "@mui/material";
import emailer from "../utils/emailer";
import Swal from "sweetalert2";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "25px",
  p: 4,
};

const SubmissionDataGrid = () => {
  const { accountId, token, email, role } = useAuthStore();

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    handleClose();
    handleConfirm();
  };

  const handleConfirm = () => {
    emailer(recipient, message, subject, null, token)
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Reminder Sent!",
          text: "Recipient has been reminded to submit their response",
          showConfirmButton: true,
          confirmButtonColor: "#262626",
        });
      })
      .catch((err) => {
        console.log(err.message);
        Swal.fire({
          icon: "error",
          title: "Reminder Not Sent!",
          text: "Unexpected Error Occurred. Please contact IT if this persists.",
          showConfirmButton: true,
          confirmButtonColor: "#262626",
        });
      });

    setRecipient("");
    setSubject("Reminder to Submit Form Response");
    setMessage(
      `Greetings from Quantum Leap Team,\n\nYour form response for the following cannot be found: \n\n1) \n\nPlease kindly submit the forms, do contact the point of contact if you have any enquiries or have already submitted them. \n\nHave a nice day, thank you! \n\nRegards, \nQuantum Leap Team \n\n\n**This is an automated email, please do not reply to this email.**`
    );
  };

  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("Reminder to Submit Form Response");
  const [message, setMessage] = useState(
    `Greetings from Quantum Leap Team,\n\nYour form response for the following cannot be found: \n\n1) \n\nPlease kindly submit the forms, do contact the point of contact if you have any enquiries or have already submitted them. \n\nHave a nice day, thank you! \n\nRegards, \nQuantum Leap Team \n\n\n**This is an automated email, please do not reply to this email.**`
  );

  const handleRecipientChange = (event) => setRecipient(event.target.value);
  const handleSubjectChange = (event) => setSubject(event.target.value);
  const handleMessageChange = (event) => setMessage(event.target.value);

  return (
    <>
      <Button
        variant="contained"
        sx={{ my: 2 }}
        color="action"
        onClick={handleOpen}
      >
        Email Reminder
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="standard"
            component="h2"
            sx={{ mb: "20px" }}
          >
            Email Reminder
          </Typography>
          <TextField
            id="outlined-basic"
            label="To: "
            variant="outlined"
            value={recipient}
            onChange={handleRecipientChange}
            sx={{ width: "100%", mb: "10px" }}
          />
          <TextField
            id="outlined-basic"
            label="Subject: "
            variant="outlined"
            value={subject}
            onChange={handleSubjectChange}
            sx={{ width: "100%", mb: "5px" }}
          />
          <TextField
            id="standard-multiline-flexible"
            label="Message Body"
            multiline
            rows={8}
            variant="outlined"
            value={message}
            onChange={handleMessageChange}
            sx={{ width: "100%", mt: "10px", mb: "140px", height: "100px" }}
          />
          <Button variant="outlined" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default SubmissionDataGrid;
