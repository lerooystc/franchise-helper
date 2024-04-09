import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { get_partner, delete_location, delete_contractor } from "../network";
import { Grid, IconButton, Stack, Typography } from "@mui/material";
import { Chart } from "react-google-charts";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import LocationCard from "./LocationCard";
import ContractorCard from "./ContractorCard";
import LocationCreation from "./LocationCreation";
import ContractorCreation from "./ContractorCreation";
import Gantt from "./Gantt";
import ConfirmationDialog from "./ConfirmationDialog";


const Partner = () => {
  const { id } = useParams();
  const [changed, setChanged] = useState(null);
  const [partner, setPartner] = useState(null);
  const [creation, setCreation] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [chosen, setChosen] = useState(null);
  const [type, setType] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await get_partner(id);
      setPartner(data);
    })();

    return () => {
    };
  }, [changed]);

  const createMode = (vare) => {
    setCreation(vare);
  }

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

  const handleDelete = async (decision, type) => {
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

  if (!partner) return <div>Loading...</div>;

  return (
    <>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} align="center">
          <Typography component='h4' variant='h4'>{partner.name}</Typography>
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
            <IconButton onClick={handle_fullscreen} size="medium" color="primary">
              {!fullscreen ? <OpenInFullIcon fontSize="medium" /> : <CloseFullscreenIcon fontSize="medium" />}
            </IconButton>
          </Stack>
          <div style={!fullscreen ? { height: "630px", overflow: "hidden" } : { height: "100%" }}>
            <Gantt fullscreen={fullscreen}></Gantt>
          </div>
        </Grid>

      </Grid>
      <ConfirmationDialog open={dialogOpen} onClose={handleDelete}></ConfirmationDialog>
    </>
  );
};

export default Partner;