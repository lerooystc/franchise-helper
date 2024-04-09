import React from "react";
import { Typography, Card, CardActionArea, CardContent } from '@mui/material';
import { withRouter } from '../withRouter';

function PartnerCard(props) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardContent onClick={() => props.navigate(`/partner/${props.data.id}`)}>
          <Typography variant="h6">{props.data.name}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default withRouter(PartnerCard);