import React, { useState } from "react";
import { Modal, TextField, IconButton, Box, Typography, Button, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { add_partner } from "../network";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function PartnerCreation(props) {
  const [open, setOpen] = useState(false);
  const [newPartner, setNewPartner] = useState({ name: "", city: "" });
  const [error, setError] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewPartner({ name: "", city: "" });
    setError(false);
  };

  const handleAdding = async () => {
    if (newPartner.name && newPartner.city) {
      await add_partner(newPartner);
      props.onChange();
      handleClose();
    } else setError(true);
  }

  return (
    <>
      <IconButton onClick={handleOpen} size="medium" color="primary">
        <AddIcon fontSize="medium" />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack spacing={3} direction="column" alignItems="center" justifyContent="center">
            <Typography component="h4" variant="h4">Создание</Typography>
            <Stack spacing={2}>
            <TextField required error={error && !newPartner.name} label="Имя" value={newPartner.name} onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}></TextField>
            <TextField required error={error && !newPartner.city} label="Адрес" value={newPartner.city} onChange={(e) => setNewPartner({ ...newPartner, city: e.target.value })}></TextField>
            <Button onClick={handleAdding}>Создать</Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
