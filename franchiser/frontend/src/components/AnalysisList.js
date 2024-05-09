import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Modal, Box, Typography, Divider, Stack } from '@mui/material';
import { get_analyses } from "../network";
import dayjs from "dayjs";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function PartnerCreation(props) {
  const [open, setOpen] = useState(true);
  const [analyses, setAnalyses] = useState([]);
  const [error, setError] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setError(false);
    props.onClose();
  };

  useEffect(() => {
    (async () => {
      console.log(props.partner);
      const data = await get_analyses(props.partner);
      setAnalyses(data);
    })();
  }, [])

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      disableScrollLock={true}
    >
      <Box sx={style}>
        <Stack spacing={3} direction="column" alignItems="center" justifyContent="center">
          <Typography component="h4" variant="h4">Анализы</Typography>
          <Stack width="100%" spacing={2} sx={{ px: 4, mt: 2, maxHeight: "50vh", overflowY: "auto" }}>
            {analyses.reverse().map((analysis, index) => {
              return <div key={index}>
                <Stack spacing={4} width="100%" direction="row" justifyContent="space-between">
                  <div>
                    <Typography color="#111" component={Link} to={`/analysis/${analysis.id}`} variant="h6">#{analyses.length - index}</Typography>
                    <Typography variant="h6">{dayjs(analysis.added_on).format('DD/MM/YYYY HH:mm')}</Typography>
                    <Typography variant="h6">Код доступа: {analysis.access_code}</Typography>
                  </div>
                  <Typography variant="h6">{analysis.finished ? "Завершен" : "В процессе"}</Typography>
                </Stack>
                <Divider />
              </div>
            })}
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}
