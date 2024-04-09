import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Stack from '@mui/material/Stack'
import { Link } from 'react-router-dom';
import { useAuthContext } from './AuthProvider';


export default function ButtonAppBar() {
  const { token, onLogout } = useAuthContext();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar color="transparent" sx={{ boxShadow: 0 }} position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Stack sx={{ flexGrow: 1 }} spacing={2} direction='row'>
            <Typography variant="h6" color="inherit" component={Link} to="/" sx={{ textDecoration: 'none' }}>
              Home
            </Typography>
            <Typography variant="h6" color="inherit" component={Link} to="/dashboard" sx={{ textDecoration: 'none' }}>
              Dashboard
            </Typography>
            <Typography variant="h6" color="inherit" component={Link} to="/news/1" sx={{ textDecoration: 'none' }}>
              News
            </Typography>
          </Stack>
          {token ? (
            <Button onClick={onLogout} to="/" component={Link} color="inherit">Logout</Button>
          ) : (
            <Button to="/login" component={Link} color="inherit">Login</Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}