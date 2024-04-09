import React, { useState } from "react";
import { Grid, TextField, Button } from '@mui/material';
import { withRouter } from '../withRouter';
import { create_contractor } from "../network";

function ContractorCreation(props) {
  const [name, setName] = useState('');

  const add_contractor = () => {
    create_contractor(name, props.partner);
    props.onChange(Math.random());
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <TextField fullWidth required label="Имя" value={name} onChange={(event) => { setName(event.target.value); }} variant="outlined" InputProps={{ style: { fontSize: '1.8rem', height: 64 } }} sx={{ '.MuiFormLabel-root[data-shrink=false]': { top: 4 } }}
        />
      </Grid>
      <Grid item xs={12} align="center">
        <Button sx={{ mx: 2 }} variant='contained' color="primary" onClick={add_contractor}>
          Создать
        </Button>
      </Grid>
    </Grid>
  );
}

export default withRouter(ContractorCreation);