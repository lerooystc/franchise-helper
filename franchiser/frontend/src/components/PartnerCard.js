import React, { useState } from "react";
import { Typography, Card, IconButton, CardHeader, Menu, MenuItem } from '@mui/material';
import { withRouter } from '../withRouter';
import MoreVertIcon from '@mui/icons-material/MoreVert';

function PartnerCard(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    props.onDialogOpen(props.data.id);
    handleClose();
  }

  const handleEdit = () => {
    props.onEdit(props.data);
    handleClose();
  }

  return (
    <>
      <Card sx={{ minWidth: 1 }}>
        <CardHeader onClick={() => props.navigate(`/partner/${props.data.id}`)} action={
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
        <MenuItem onClick={handleEdit}>Изменить</MenuItem>
        <MenuItem onClick={handleDelete}>Удалить</MenuItem>
      </Menu>
    </>
  );
}

export default withRouter(PartnerCard);