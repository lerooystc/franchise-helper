import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Grid, Typography, Stack, Button } from "@mui/material";
import { get_partners, get_tasks } from "../network";
import PartnerList from "./PartnerList";

export const Dashboard = () => {
  const [partners, setPartners] = useState(null);
  const [tasks, setTasks] = useState(null);

  const getPartners = async () => {
    const data = await get_partners();
    setPartners(data);
  }

  const getTasks = async () => {
    const data = await get_tasks();
    setTasks(data);
  }

  useEffect(() => {
    (async () => {
      await getPartners();
      await getTasks();
    })();

    return () => {
    };
  }, []);


  return (
    <Grid container justifyContent='center' spacing={3}>
      <Grid item xs={6} align="center">
        <Stack spacing={2} direction="column" alignItems="center" justifyContent="center">
          <Typography component='h4' variant='h4'>Партнеры</Typography>
          <PartnerList partners={partners} />
        </Stack>
      </Grid>
      <Grid item xs={6} align="center">
        <Stack spacing={2} direction="column" alignItems="center" justifyContent="center">
          <Typography component='h4' variant='h4'>Шаблон этапов</Typography>
          <Stack spacing={1}>
            {
              tasks?.map(task => {
                return (
                  <Stack key={task.id} spacing={2} direction="row" alignItems="center" justifyContent="space-around">
                    <Typography variant="h6">{task.title}</Typography>
                    <Typography variant="h6">{task.description}</Typography>
                    <Typography variant="h6">{task.duration}</Typography>
                    <Typography variant="h6">{task.related_ids}</Typography>
                  </Stack>
                )
              })
            }
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
}