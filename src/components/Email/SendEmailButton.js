import React, { useState, useRef } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import emailer from "../../utils/emailer";
import { useAuthStore } from "../../store";

function SendEmailButton({ defaultRecipient ='', defaultSubject='' }) {
  const [open, setOpen] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [msgBody, setMsgBody] = useState("");
  const [subject, setSubject] = useState("");
  const [attachment, setAttachment] = useState("");
  const { token } = useAuthStore();
  const formRef = useRef();
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    if (formRef.current.reportValidity()) {
      emailer(recipient, msgBody, subject, attachment, token)
        .then((response) => {
          console.log("Email sent successfully!");
          handleClose();
        })
        .catch((error) => {
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
        <DialogTitle>Send Email</DialogTitle>
        <form ref={formRef} onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Recipient"
              type="email"
              fullWidth
              defaultValue={defaultRecipient}
              required
              onChange={(event) => setRecipient(event.target.value)}
            />
            <TextField
              margin="dense"
              label="Subject"
              type="text"
              fullWidth
              required
              defaultValue={defaultSubject}
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
