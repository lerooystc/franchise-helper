import React, { useState, useEffect } from "react";
import { Grid, Typography, Stack, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { Link } from "react-router-dom";
import { get_partners, get_tasks } from "../network";
import PartnerCard from "./PartnerCard";
import Gantt from "./Gantt";
import PartnerCreation from "./PartnerCreation";

export const Dashboard = () => {
  const [partners, setPartners] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [tasksLoaded, setTasksLoaded] = useState(false);
  const [changed, setChanged] = useState(false);

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
      if (!tasksLoaded) await getTasks();
    })();

    return () => {
    };
  }, [changed]);

  const handleChange = () => {
    setChanged(!changed);
  }

  return (
    <Grid container justifyContent='center' spacing={4}>
      <Grid item xs={4} align="center">
        <Stack spacing={2} direction="column" alignItems="center" justifyContent="center">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography component='h4' variant='h4'>Партнеры</Typography>
            <PartnerCreation onChange={handleChange}></PartnerCreation>
          </Stack>
          <Stack spacing={1} alignItems="start" justifyContent="center" width="100%" textAlign="start">
            {
              partners?.map(partner => {
                return <PartnerCard key={partner.id} data={partner} />
              })
            }
          </Stack>
        </Stack>
      </Grid>
      <Grid item xs={4} align="center">
        <Stack spacing={2} direction="column" alignItems="center" justifyContent="center">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography component='h4' variant='h4'>Шаблон этапов</Typography>
            <IconButton to="/dashboard/tasks" component={Link} size="medium" color="primary">
              <EditIcon fontSize="medium" />
            </IconButton>
          </Stack>
          {tasks && <Gantt tasks={tasks} start_date={new Date()}></Gantt>}
        </Stack>
      </Grid>
    </Grid>
  );
}