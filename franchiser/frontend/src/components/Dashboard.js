import React, { useState, useEffect } from "react";
import { Grid, Typography, Stack, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from "react-router-dom";
import { get_partners, get_tasks, delete_partner } from "../network";
import PartnerCard from "./PartnerCard";
import Gantt from "./Gantt";
import PartnerModal from "./PartnerModal";
import ConfirmationDialog from "./ConfirmationDialog";

export const Dashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [partners, setPartners] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [tasksLoaded, setTasksLoaded] = useState(false);
  const [changed, setChanged] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [chosen, setChosen] = useState(null);
  const [editData, setEditData] = useState(null);

  const getPartners = async () => {
    const data = await get_partners();
    setPartners(data);
  }

  const getTasks = async () => {
    const data = await get_tasks();
    setTasks(data);
    setTasksLoaded(true);
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
    setModalOpen(false);
    setEditData(null);
    setChanged(!changed);
  }

  const handleDialogOpen = (value) => {
    setDialogOpen(true);
    setChosen(value);
  }

  const handleDelete = async (decision) => {
    setDialogOpen(false);
    if (decision) {
      await delete_partner(chosen);
      setChanged(!changed);
    }
  }

  const handleEdit = (data) => {
    setModalOpen(true);
    setEditData(data)
  };

  return (
    <Grid container justifyContent='center' spacing={4}>
      <Grid item xs={4} align="center">
        <Stack spacing={2} direction="column" alignItems="center" justifyContent="center">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography component='h4' variant='h4'>Партнеры</Typography>
            <IconButton onClick={() => setModalOpen(true)} size="medium" color="primary">
              <AddIcon fontSize="medium" />
            </IconButton>
          </Stack>
          <Stack spacing={1} alignItems="start" justifyContent="center" width="100%" textAlign="start">
            {
              partners?.map(partner => {
                return <PartnerCard onDialogOpen={handleDialogOpen} onEdit={handleEdit} key={partner.id} data={partner} />
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
          {tasks.length > 0 && <Gantt tasks={tasks} start_date={new Date()}></Gantt>}
        </Stack>
      </Grid>
      <PartnerModal open={modalOpen} onChange={handleChange} editData={editData}></PartnerModal>
      <ConfirmationDialog open={dialogOpen} onClose={handleDelete}></ConfirmationDialog>
    </Grid>
  );
}