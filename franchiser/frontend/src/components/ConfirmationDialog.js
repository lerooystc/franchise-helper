import React from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


export default function ConfirmationDialog(props) {
  const { onClose, open } = props;

  const handleClose = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={() => handleClose(false)} open={open}>
      <DialogTitle id="alert-dialog-title">
        {"Вы уверены?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Вы уверены?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(false)}>Нет</Button>
        <Button onClick={() => handleClose(true)}>Да</Button>
      </DialogActions>
    </Dialog>
  );
}