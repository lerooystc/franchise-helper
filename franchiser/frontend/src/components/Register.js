import React, { Component } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import { withRouter } from "../withRouter";
import { register_account } from "../network";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: "",
      email: "",
      password: "",
    };
  }

  handleLoginChange = (e) => {
    this.setState({
      login: e.target.value,
    });
  }

  handleEmailChange = (e) => {
    this.setState({
      email: e.target.value,
    });
  }

  handlePasswordChange = (e) => {
    this.setState({
      password: e.target.value,
    });
  }

  registerPressed = () => {
    register_account(this.state.login, this.state.email, this.state.password);
    this.props.navigate('/');
  }

  render() {
    return (
      <Grid container spacing={1} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignContent: 'center', height: '100%' }}>
        <Grid item xs={12} align="center">
          <Typography component='h4' variant='h4'>Регистрация</Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <TextField required label="Логин" value={this.state.login} onChange={this.handleLoginChange} variant="outlined" />
        </Grid>
        <Grid item xs={12} align="center">
          <TextField required label="Эл. почта" value={this.state.email} onChange={this.handleEmailChange} variant="outlined" />
        </Grid>
        <Grid item xs={12} align="center">
          <TextField required label="Пароль" value={this.state.password} onChange={this.handlePasswordChange} type="password" variant="outlined" />
        </Grid>
        <Grid item xs={12} align="center">
          <Button sx={{ mx: 2 }} variant='contained' color="primary" onClick={this.registerPressed}>
            Регистрация
          </Button>
          <Button sx={{ mx: 2 }} variant='contained' color="secondary" to="/" component={Link}>
            Назад
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(Register);