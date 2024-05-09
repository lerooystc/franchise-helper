import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import Stack from '@mui/material/Stack'
import { Link } from 'react-router-dom';
import { useAuthContext } from './AuthProvider';
import Notifications from './Notifications';


export default function ButtonAppBar() {
  const { token, onLogout } = useAuthContext();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar color="transparent" sx={{ boxShadow: 0 }} position="static">
        <Toolbar>
          <Stack sx={{ flexGrow: 1 }} spacing={2} direction='row' alignItems="center">
            <IconButton component={Link} to="/">
              <HomeIcon />
            </IconButton>
            {token && (
              <Typography variant="h6" color="inherit" component={Link} to="/dashboard" sx={{ textDecoration: 'none' }}>
                Кабинет
              </Typography>
            )}
            <Typography variant="h6" color="inherit" component={Link} to="/news/1" sx={{ textDecoration: 'none' }}>
              Новости
            </Typography>
          </Stack>
          {token ? (
            <Stack direction="row" alignItems="center" justifyContent="center">
              <Notifications></Notifications>
              <Button onClick={onLogout} to="/" component={Link} color="inherit">Logout</Button>
            </Stack>
          ) : (
            <Button to="/login" component={Link} color="inherit">Login</Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}