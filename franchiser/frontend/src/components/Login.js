import React, { useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import { withRouter } from '../withRouter';
import { useAuthContext } from './AuthProvider';

function Login(props) {
  const { onLogin } = useAuthContext();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginChange = (e) => {
    setLogin(e.target.value);
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }

  const loginPressed = () => {
    onLogin(login, password);
    props.navigate('/');
  }

  
  return (
      <Grid container spacing={1} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignContent: 'center', height: '100%' }}>
        <Grid item xs={12} align="center">
          <Typography component='h4' variant='h4'>Войти</Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <TextField required label="Логин" value={login} onChange={handleLoginChange} variant="outlined" />
        </Grid>
        <Grid item xs={12} align="center">
          <TextField required label="Пароль" value={password} onChange={handlePasswordChange} type="password" variant="outlined" />
        </Grid>
        <Grid item xs={12} align="center">
          <Button sx={{ mx: 2 }} variant='contained' color="primary" onClick={loginPressed}>
            Войти
          </Button>
          <Button sx={{ mx: 2 }} variant='contained' color="secondary" to="/" component={Link}>
            Назад
          </Button>
        </Grid>
      </Grid>
    );
}

export default withRouter(Login);