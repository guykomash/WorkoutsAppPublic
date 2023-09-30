import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';

import { useState } from 'react';

const DeleteBtnWithDialog = ({ title, content, id, onDelete }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button id={`delete-btn-${id}`} color="error" onClick={handleClickOpen}>
        <DeleteIcon></DeleteIcon>
      </Button>
      <Dialog
        id={`delete-dialog-${id}`}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id={`alert-dialog-title-${id}`}>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id={`alert-dialog-description-${id}`}>
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              onDelete(id);
              handleClose();
            }}
            autoFocus
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteBtnWithDialog;
