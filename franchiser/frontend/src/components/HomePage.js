import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Grid, Typography, ButtonGroup, Button } from "@mui/material";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Grid container spacing={3} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignContent: 'center', height: '100%' }}>
        <Grid item xs={12} align="center">
          <Typography variant="h3" compact="h3">
            Franchise Helper
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <ButtonGroup disableElevation variant="contained" color="primary">
            <Button color="primary" to="/login" component={Link}>
              Войти
            </Button>
            <Button color="secondary" to="/register" component={Link}>
              Регистрация
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    );
  }
}