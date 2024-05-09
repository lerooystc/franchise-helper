import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { get_partner, edit_partner, delete_location, delete_contractor, get_tasks } from "../network";
import { Grid, IconButton, Stack, Button, Typography, FormGroup, FormControlLabel, Checkbox, Alert, Menu, MenuItem } from "@mui/material";
import dayjs from "dayjs";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import EditIcon from '@mui/icons-material/Edit';
import LocationCard from "./LocationCard";
import ContractorCard from "./ContractorCard";
import LocationCreation from "./LocationCreation";
import ContractorCreation from "./ContractorCreation";
import Gantt from "./Gantt";
import ConfirmationDialog from "./ConfirmationDialog";
import Analysis from "./Analysis";
import AnalysisList from "./AnalysisList";


const Partner = () => {
  const { id } = useParams();
  const [changed, setChanged] = useState(null);
  const [partner, setPartner] = useState(null);
  const [bpTasks, setBpTasks] = useState([]);
  const [creation, setCreation] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [analysisMode, setAnalysisMode] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [chosen, setChosen] = useState(null);
  const [type, setType] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuOpen = Boolean(anchorEl);

  useEffect(() => {
    (async () => {
      const data = await get_partner(id);
      setPartner({ ...data, starting_date: dayjs(data.starting_date) });
      const bp_tasks = await get_tasks();
      setBpTasks([].concat(bp_tasks)
        .sort((a, b) => a.local_id > b.local_id ? 1 : -1));
    })();

    return () => {
    };
  }, [changed]);

  const createMode = (vare) => {
    setCreation(vare);
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (type) => {
    setAnalysisMode(type);
    setAnchorEl(null);
  };

  const handle_change = React.useCallback((new_value) => {
    setChanged(new_value);
    setCreation('');
  }, [])

  const handle_fullscreen = () => {
    if (!fullscreen) {
      document.querySelector("#main").style.position = "static";
    } else {
      document.querySelector("#main").style.position = "fixed";
    }
    setFullscreen(prevFullscreen => !prevFullscreen);
  }

  const handleDialogOpen = (value, type) => {
    setDialogOpen(true);
    setChosen(value);
    setType(type);
  }

  const handleDelete = async (decision) => {
    setDialogOpen(false);
    if (decision) {
      if (type == 'location') {
        await delete_location(chosen);
      }
      else {
        await delete_contractor(chosen);
      }
    }
    setChanged(!changed);
  }

  const handleCheck = (task) => {
    if (partner.tasks.some(obj => obj.id === task.id)) {
      setPartner({ ...partner, tasks: partner.tasks.filter(obj => ![obj.id].concat(obj.parents).includes(task.id)) })
    } else {
      setPartner({ ...partner, tasks: [...partner.tasks, task] })
    }
  }

  const handleGantt = async () => {
    const data = { ...partner, gantt_created: true, starting_date: partner.starting_date.format("YYYY-MM-DD") };
    setPartner({ ...partner, gantt_created: true });
    await edit_partner(id, data);
  }

  if (!partner) return <div>Loading...</div>;

  return (
    <>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} align="center">
          <Stack spacing={4} direction="row" alignItems="center" justifyContent="center">
            <Typography component='h4' variant='h4'>{partner.name}</Typography>
            <Button onClick={handleMenuOpen} size="large" variant="outlined">Анализ</Button>
            <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
              <MenuItem onClick={() => handleMenuClose(1)}>Список</MenuItem>
              <MenuItem onClick={() => handleMenuClose(2)}>Создать</MenuItem>
            </Menu>
            {analysisMode === 1 && <AnalysisList onClose={() => setAnalysisMode(0)} partner={partner.id}></AnalysisList>}
            {analysisMode === 2 && <Analysis onClose={() => setAnalysisMode(0)} partner={partner.id}></Analysis>}
          </Stack>
        </Grid>
        {!fullscreen && (<><Grid item xs={3} align="start">
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography component='h5' variant='h5'>Помещения</Typography>
            {creation != "location" ? (
              <IconButton onClick={() => { createMode('location') }} size="medium" color="primary">
                <AddIcon fontSize="medium" />
              </IconButton>
            ) : (
              <IconButton onClick={() => { createMode('') }} size="medium" color="primary">
                <CloseIcon fontSize="medium" />
              </IconButton>
            )}
          </Stack>
          {creation != "location" ? (
            partner.locations.map(location => {
              return <LocationCard onDialogOpen={handleDialogOpen} key={location.id} data={location} />
            })
          ) : (
            <LocationCreation onChange={handle_change} partner={id} />
          )}
        </Grid>
          <Grid item xs={3} align="start">
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography component='h5' variant='h5'>Подрядчики</Typography>
              {creation != "contractor" ? (
                <IconButton onClick={() => { createMode('contractor') }} size="medium" color="primary">
                  <AddIcon fontSize="medium" />
                </IconButton>
              ) : (
                <IconButton onClick={() => { createMode('') }} size="medium" color="primary">
                  <CloseIcon fontSize="medium" />
                </IconButton>
              )}
            </Stack>
            {creation != "contractor" ? (
              partner.contractors.map(contractor => {
                return <ContractorCard onDialogOpen={handleDialogOpen} key={contractor.id} data={contractor} />
              })
            ) : (
              <ContractorCreation onChange={handle_change} partner={id} />
            )}
          </Grid></>)}

        <Grid item xs={!fullscreen ? 3 : 10} align="start">
          <Stack spacing={2} direction="row" alignItems="center" justifyContent={!fullscreen ? "space-between" : "center"}>
            <Typography component='h5' variant='h5'>Этапы</Typography>
            <Stack direction="row">
              {partner.gantt_created &&
                <IconButton onClick={() => setPartner({ ...partner, gantt_created: !partner.gantt_created })} size="medium" color="primary">
                  <EditIcon fontSize="medium" />
                </IconButton>
              }
              <IconButton onClick={handle_fullscreen} size="medium" color="primary">
                {!fullscreen ? <OpenInFullIcon fontSize="medium" /> : <CloseFullscreenIcon fontSize="medium" />}
              </IconButton>
            </Stack>
          </Stack>
          <div style={!fullscreen ? { height: "630px", overflow: "hidden" } : { height: "100%" }}>
            {partner.gantt_created ? (
              bpTasks?.some(task => { return (!task.parents.every(pid => partner.tasks.some(el => el.id === pid))) && partner.tasks.some(obj => obj.id === task.id) }) ?
                <Alert severity="error">В шаблоне обновились связи, отредактируйте диаграмму.</Alert> :
                <Gantt tasks={partner.tasks} start_date={partner.starting_date} fullscreen={fullscreen}></Gantt>) :
              <Stack spacing={2} direction="column" alignItems="center" justifyContent="center">
                <DatePicker label="Дата начала работ" value={partner.starting_date} onChange={(newValue) =>
                  setPartner({ ...partner, starting_date: newValue })
                } sx={{ marginTop: "10px !important" }}></DatePicker>
                <FormGroup>
                  {bpTasks?.map(task => {
                    return <FormControlLabel disabled={!task.parents.every(pid => partner.tasks.some(el => el.id === pid))} key={task.id} control={<Checkbox onChange={() => handleCheck(task)}
                      checked={partner.tasks.some(obj => obj.id === task.id)} />} label={`${task.title} - ${task.duration} дней`} />
                  })}
                </FormGroup>
                <Button disabled={!(partner.tasks && partner.starting_date)} variant='contained' color="primary" onClick={handleGantt}>Сохранить</Button>
              </Stack>
            }
          </div>
        </Grid>
      </Grid >
      <ConfirmationDialog open={dialogOpen} onClose={handleDelete}></ConfirmationDialog>
    </>
  );
};

export default Partner;