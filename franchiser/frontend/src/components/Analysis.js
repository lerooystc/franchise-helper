import React, { useState, useEffect } from "react";
import { Modal, TextField, IconButton, Box, Typography, Button, Stack, Menu, MenuItem, FormControl, Select, InputLabel, Link, Checkbox, FormControlLabel } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { add_analysis, get_templates } from "../network";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function Analysis(props) {
  const [open, setOpen] = useState(true);
  const [added, setAdded] = useState(false);
  const [accessData, setAccessData] = useState(null);
  const [fields, setFields] = useState([]);
  const [analysisTitle, setAnalysisTitle] = useState("Новый анализ");
  const [templates, setTemplates] = useState([]);
  const [templateChosen, setTemplateChosen] = useState('');
  const [isTemplate, setIsTemplate] = useState(false);
  const [error, setError] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentId, setCurrentId] = useState(1);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    (async () => {
      const data = await get_templates();
      setTemplates(data);
    })();
  }, [])

  const addField = (type) => {
    const field = (() => {
      switch (type) {
        case "bool":
          return { id: currentId, title: "", type: "bool", weight: 3 };
        case "string":
          return { id: currentId, title: "", type: "str" };
        case "number":
          return { id: currentId, title: "", type: "number", sign: 1, value: 0, weight: 3 };
        case "range":
          return { id: currentId, title: "", type: "range", lval: 0, hval: 0, weight: 3 };
      }
    })();
    setError(false);
    setFields([...fields, field]);
    setCurrentId(currentId + 1);
    handleMenuClose();
    console.log(fields);
  }

  const handleClose = () => {
    setOpen(false);
    setFields([]);
    setError(false);
    setAdded(false);
    props.onClose();
  };

  const handleAdding = async () => {
    if (fields.every((el) => Object.values(el).every(e => e)) && analysisTitle) {
      const analysis = { partner: props.partner, title: analysisTitle, criteria: fields, finished: false, cases: [], is_template: isTemplate };
      const results = await add_analysis(analysis);
      setAccessData(results);
      setAdded(true);
    } else setError(true);
  }

  const handleChange = (newField) => {
    setFields(fields?.map(field => {
      if (field.id === newField.id) {
        return newField;
      } else return field;
    }));
    console.log(templates);
  }

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableScrollLock={true}
      >
        <Box sx={style}>
          {!added ?
            <Stack spacing={3} direction="column" alignItems="center" justifyContent="center">
              <Stack spacing={3} direction="row" alignItems="center" justifyContent="center">
                <Typography component="h4" variant="h4">Анализ</Typography>
                <IconButton size="medium" color="primary"
                  id="basic-button"
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleMenuClick}>
                  <AddIcon fontSize="medium" />
                </IconButton>
              </Stack>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem onClick={() => addField("string")}>Строка</MenuItem>
                <MenuItem onClick={() => addField("bool")}>Да/Нет</MenuItem>
                <MenuItem onClick={() => addField("number")}>Число</MenuItem>
                <MenuItem onClick={() => addField("range")}>Рамки</MenuItem>
              </Menu>
              <Stack spacing={2} direction="row" alignItems="center" justifyContent="center">
                <TextField error={error && !analysisTitle} label="Название анализа" value={analysisTitle} onChange={(e) => setAnalysisTitle(e.target.value)} />
                <FormControl sx={{ m: 1, width: 210 }}>
                  <InputLabel id="template">Шаблон</InputLabel>
                  <Select
                    labelId="template"
                    value={templateChosen}
                    label="Шаблон"
                    onChange={(e) => {
                      setTemplateChosen(e.target.value);
                      const template = templates.find(x => x.id === e.target.value);
                      setFields(template.criteria);
                      setCurrentId(template.criteria.length + 1);
                    }}
                  >
                    {templates?.map(template => {
                      return <MenuItem key={template.id} value={template.id}>{template.title}</MenuItem>
                    })}
                  </Select>
                </FormControl>
                <FormControlLabel label="Сохранить как шаблон" control={<Checkbox checked={isTemplate} onChange={(e) => { setIsTemplate(e.target.checked) }} />} />
              </Stack>
              <Stack spacing={2} sx={{ px: 4, mt: 2, maxHeight: "50vh", overflowY: "auto" }}>
                {fields?.map(field => {
                  return <Stack key={field.id} spacing={3} direction="row" alignItems="center" justifyContent="space-between">
                    <TextField width="166px" required error={error && !field.title} label="Критерий" value={field.title} onChange={(e) => {
                      field.title = e.target.value;
                      handleChange(field)
                    }}></TextField>
                    {(field.type === "number") && <>
                      <FormControl sx={{ m: 1, width: 210 }}>
                        <InputLabel id="sign">Знак</InputLabel>
                        <Select
                          labelId="sign"
                          value={field.sign}
                          label="Знак"
                          error={error && !field.sign}
                          onChange={(e) => {
                            field.sign = e.target.value;
                            handleChange(field)
                          }}
                        >
                          <MenuItem value={1}>Больше</MenuItem>
                          <MenuItem value={2}>Меньше</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField required error={error && !field.value} label="Значение" value={field.value} onChange={(e) => {
                        field.value = parseInt(e.target.value);
                        handleChange(field)
                      }} type="number" onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}></TextField>
                    </>}
                    {(field.type === "range") && <>
                      <TextField required error={error && !field.lval} label="От" value={field.lval} onChange={(e) => {
                        field.lval = parseInt(e.target.value);
                        handleChange(field)
                      }} type="number" onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}></TextField>
                      <TextField required error={error && !field.hval} label="До" value={field.hval} onChange={(e) => {
                        field.hval = parseInt(e.target.value);
                        handleChange(field)
                      }} type="number" onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}></TextField></>}
                    {(field.type !== "str") && <>
                      <FormControl sx={{ m: 1, width: 210 }}>
                        <InputLabel id="weight">Важность</InputLabel>
                        <Select
                          labelId="weight"
                          value={field.weight}
                          label="Важность"
                          error={error && !field.weight}
                          onChange={(e) => {
                            field.weight = e.target.value;
                            handleChange(field)
                          }}
                        >
                          <MenuItem value={5}>Очень высокая</MenuItem>
                          <MenuItem value={4}>Высокая</MenuItem>
                          <MenuItem value={3}>Средняя</MenuItem>
                          <MenuItem value={2}>Низкая</MenuItem>
                          <MenuItem value={1}>Очень низкая</MenuItem>
                        </Select>
                      </FormControl>
                    </>}
                  </Stack>
                })}
                {/* <TextField required error={error && !newPartner.name} label="Имя" value={newPartner.name} onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}></TextField>
              <TextField required error={error && !newPartner.city} label="Адрес" value={newPartner.city} onChange={(e) => setNewPartner({ ...newPartner, city: e.target.value })}></TextField> */}
                <Button onClick={handleAdding}>Создать</Button>
              </Stack>
            </Stack> :
            <Stack spacing={3} direction="column" alignItems="center" justifyContent="center">
              <Typography component="h4" variant="h4">Успешно!</Typography>
              <Link href={"/analysis/" + accessData.id}>Ссылка для распространения</Link>
              <Typography variant="body1">Код для входа: {accessData.code}</Typography>
            </Stack>
          }
        </Box>
      </Modal>
    </>
  );
}
