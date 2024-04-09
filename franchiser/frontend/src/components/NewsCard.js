import React from "react";
import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function NewsCard(props) {

  return (
    <Card sx={{ maxWidth: 345, height: 360 }}>
      <CardMedia
        component="img"
        height="230"
        sx={{ objectFit: "contain" }}
        image={props.data.image}
        title={props.data.title}
        alt={props.data.title}
      />
      <CardContent component={Link} to={props.data.url} sx={{ textDecoration: 'none', color: "black" }}>
        <Typography gutterBottom variant="body1" component="div">
          {props.data.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {props.data.date_published}
        </Typography>
      </CardContent>
    </Card>
  )
}

