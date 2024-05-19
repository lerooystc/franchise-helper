import React, { useState, useEffect } from "react";
import { Modal, TextField, IconButton, Box, Typography, Button, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { add_partner, edit_partner } from "../network";

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

export default function PartnerModal(props) {
  const [newPartner, setNewPartner] = useState({ name: "", city: "" });
  const [error, setError] = useState(false);
  const [parsed, setParsed] = useState(false);

  const handleClose = () => {
    props.onChange();
    setNewPartner({ name: "", city: "" });
    setError(false);
    setParsed(false);
  };

  const handleAdding = async () => {
    if (newPartner.name && newPartner.city) {
      if (props.editData) { 
        await edit_partner(props.editData.id, newPartner);
      } else await add_partner(newPartner);
      handleClose();
    } else setError(true);
  };

  useEffect(() => {
    if (props.editData && !parsed) {
      setNewPartner({ name: props.editData.name, city: props.editData.city });
      setParsed(true);
    }
  });

  return (
      <Modal
        open={props.open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack spacing={3} direction="column" alignItems="center" justifyContent="center">
            <Typography component="h4" variant="h4">{props.editData ? "Изменение" : "Создание"}</Typography>
            <Stack spacing={2}>
            <TextField required error={error && !newPartner.name} label="Имя" value={newPartner.name} onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}></TextField>
            <TextField required error={error && !newPartner.city} label="Адрес" value={newPartner.city} onChange={(e) => setNewPartner({ ...newPartner, city: e.target.value })}></TextField>
            <Button onClick={handleAdding}>{props.editData ? "Изменить" : "Создать"}</Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
  );
}
