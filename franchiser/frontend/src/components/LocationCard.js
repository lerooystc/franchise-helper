import React, { useState } from "react";
import { Typography, Card, IconButton, CardHeader, Menu, MenuItem } from '@mui/material';
import { withRouter } from '../withRouter';
import MoreVertIcon from '@mui/icons-material/MoreVert';

function LocationCard(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleOpen = () => {
    props.onDialogOpen(props.data.id, 'location');
    handleClose();
  }

  return (
    <>
      <Card>
        <CardHeader onClick={() => props.navigate(`/location/${props.data.id}`)} action={
          <div>
            <IconButton onClick={event => {
              event.stopPropagation();
              event.preventDefault();
              handleClick(event);
            }} aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          </div>
        }
          title={
            <Typography display="inline" variant="h6">{props.data.name}</Typography>
          }
        >
        </CardHeader>
      </Card>
      <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
        <MenuItem onClick={handleOpen}>Удалить</MenuItem>
      </Menu>
    </>
  );
}

export default withRouter(LocationCard);