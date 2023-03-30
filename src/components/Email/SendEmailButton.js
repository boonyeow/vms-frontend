import React, { useState, useRef } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import emailer from "../../utils/emailer";
import { useAuthStore } from "../../store";

function SendEmailButton({ defaultRecipient ='', defaultSubject='' }) {
  const [open, setOpen] = useState(false);
  const [recipient, setRecipient] = useState(defaultRecipient);
  const [msgBody, setMsgBody] = useState("");
  const [subject, setSubject] = useState(defaultSubject);
  const [attachment, setAttachment] = useState("");
  const { token } = useAuthStore();
  const [successAlert, setSuccessAlert] = useState(false)
  const [successMessage, setSuccessMessage] = useState('');
  const formRef = useRef();
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setRecipient(defaultRecipient);
    setSubject(defaultSubject);
    setSuccessAlert(false);
    setOpen(false);
  };

  const handleSubmit = () => {
    if (formRef.current.reportValidity()) {
       emailer(recipient, msgBody, subject, attachment, token)
         .then((res) => {
          setSuccessMessage("Email sent successfully!");
          setSuccessAlert(true)
           setTimeout(() => {
             setSuccessAlert(false);
             handleClose();
           }, 2000);
          console.log("Email sent successfully!");

        })
         .catch((error) => {
           setSuccessMessage("Error sending email!");
           setSuccessAlert(true);
          console.error("Error sending email:", error);
        });
    } else {
      return;
    }
  };

  return (
    <>
      <Button variant="outlined" size="small" onClick={handleOpen}>
        Send Email
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <Snackbar
          open={successAlert}
          autoHideDuration={2000}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity={successMessage.includes('Error') ? 'error' : 'success'} sx={{ width: "100%" }}>
           {successMessage}
          </Alert>
        </Snackbar>
        <DialogTitle>Send Email</DialogTitle>
        <form ref={formRef} onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Recipient"
              type="email"
              fullWidth
              value={recipient}
              required
              onChange={(event) => setRecipient(event.target.value)}
            />
            <TextField
              margin="dense"
              label="Subject"
              type="text"
              fullWidth
              required
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
            />
            <TextField
              margin="dense"
              label="Message Body"
              type="text"
              fullWidth
              required
              multiline
              rows={4}
              onChange={(event) => setMsgBody(event.target.value)}
            />
            <TextField
              margin="dense"
              type="file"
              fullWidth
              onChange={(event) => setAttachment(event.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Send</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

export default SendEmailButton;
