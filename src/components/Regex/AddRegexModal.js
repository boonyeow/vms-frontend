import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Stack,
  TextField,
  MenuItem,
} from "@mui/material";
const AddRegexModal = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add a validation rule</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To add a new validation rule, please fill in the following details.
        </DialogContentText>

        <Stack spacing={3}>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="pattern"
            label="Pattern"
            fullWidth
            variant="standard"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClose}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};
