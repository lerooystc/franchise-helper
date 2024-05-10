import React, { useState, useEffect } from 'react';
import { Popover, Divider, IconButton, Typography, Stack } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import dayjs from 'dayjs';
import { get_notifications, mark_as_seen } from '../network';
import { Link } from 'react-router-dom';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [icon, setIcon] = useState(false);

  const handleClick = async (event) => {
    setIcon(false);
    setAnchorEl(event.currentTarget);
    await mark_as_seen();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    (async () => {
      const data = await get_notifications();
      if (data.some((notif) => notif.seen === false)) setIcon(true);
      setNotifications(data);
    })();
  }, [])

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <IconButton aria-describedby={id} onClick={handleClick}>
        {icon ? <NotificationsActiveIcon /> : <NotificationsIcon />}
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Stack width="400px" direction="column" justifyContent="center" alignItems="start">
          {notifications.map(notification => {
            return <div key={notification.id}>
              <Stack sx={{p: 1}} spacing={2} direction="column" justifyContent="start" alignItems="start">
                <Typography component={Link} to={notification.link} color="#000" variant={"body1"} sx={!notification.seen ? {fontWeight: "bold"} : {}}>{notification.title}</Typography>
                <Typography variant="body1">{dayjs(notification.added_on).format("DD/MM HH:mm")}</Typography>
              </Stack>
              <Divider width="400px"/>
            </div>
          })}
        </Stack>
      </Popover>
    </div>
  )
}