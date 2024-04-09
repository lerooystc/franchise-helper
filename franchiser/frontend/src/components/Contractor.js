import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid, IconButton, Stack, TextField, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { get_contractor, edit_contractor } from "../network";

export const Contractor = () => {
  const { id } = useParams();
  const [changed, setChanged] = useState(false);
  const [location, setLocation] = useState(null);
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    (async () => {
      console.log(changed);
      const data = await get_contractor(id);
      setLocation(data);
      setName(data.name);
      editMode(false);
    })();

    return () => {
    };
  }, [changed]);

  const editMode = (val) => {
    setEditing(val);
  }

  const save_changes = () => {
    edit_contractor(id, name);
    setChanged(!changed);
  }

  if (!location) return <div>Loading...</div>;

  return (
    <Grid container spacing={4} justifyContent="center">
      <Grid item xs={12} align="center">
        <Stack spacing={2} direction="row" alignItems="center" justifyContent="center">
          <Typography component='h4' variant='h4'>Подрядчик</Typography>
          {!editing ? (
            <IconButton onClick={() => editMode(true)} size="medium" color="primary">
              <EditIcon fontSize="medium" />
            </IconButton>
          ) : (<>
            <IconButton onClick={save_changes} size="medium" color="primary">
              <CheckIcon fontSize="medium" />
            </IconButton>
            <IconButton onClick={() => editMode(false)} size="medium" color="primary">
              <CloseIcon fontSize="medium" />
            </IconButton> </>
          )}
        </Stack>
      </Grid>

      {!editing ? (
        <Grid item xs={3} align="center">
          <Typography display="inline" component='h5' variant='h5'>Имя: {location.name}</Typography>
        </Grid>
      ) : (
        <Grid item xs={3} align="center">
          <TextField required label="Имя" value={name} onChange={(event) => { setName(event.target.value); }} variant="outlined"></TextField>
        </Grid>
      )
      }

    </Grid>

  )
}