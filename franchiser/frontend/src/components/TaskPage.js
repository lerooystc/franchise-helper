import React, { useState, useEffect } from "react";
import { Typography, Stack, TextField, Button, IconButton, FormControl, Select, InputLabel, MenuItem, OutlinedInput } from "@mui/material";
import UpIcon from '@mui/icons-material/KeyboardArrowUp';
import DownIcon from '@mui/icons-material/KeyboardArrowDown';
import CloseIcon from '@mui/icons-material/Close';
import { get_tasks, add_tasks, delete_task } from "../network";
import ConfirmationDialog from "./ConfirmationDialog";

export const TaskPage = () => {

  const [tasks, setTasks] = useState();
  const [lastId, setLastId] = useState();
  const [chosen, setChosen] = useState();
  const [saving, setSaving] = useState(false);
  const [editingTasks, setEditingTasks] = useState(false);
  const [editingRelations, setEditingRelations] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const getTasks = async () => {
    let data = await get_tasks();
    setLastId(data.length);
    setTasks([].concat(data)
      .sort((a, b) => a.local_id > b.local_id ? 1 : -1));
  }

  function handleChange(e, taskId, type) {
    setTasks(tasks.map(task => {
      if (task.local_id === taskId) {
        switch (type) {
          case 'title':
            return { ...task, title: e.target.value };
          case 'duration':
            return { ...task, duration: parseInt(e.target.value) };
          case 'ids':
            return { ...task, parents: e.target.value };
        }
      } else {
        return task;
      }
    }));
    console.log(tasks);
  }

  function handleCreation() {
    setTasks([...tasks, { local_id: lastId + 1, title: "", description: "", duration: "", parents: [] }]);
    setLastId(lastId + 1);
  }

  const handleSaving = async () => {
    const validation = tasks.every(item => item.title && item.duration);
    if (validation) {
      setSaving(true);
      await add_tasks(tasks);
      setSaving(false);
      setEditingTasks(false);
      setEditingRelations(false);
    } else {
      alert("Please fill out the required fields.");
    }
  }

  const handleDialogOpen = (value) => {
    setDialogOpen(true);
    setChosen(value);
  }

  const handleDelete = async (decision) => {
    setDialogOpen(false);
    if (decision) {
      await delete_task(chosen);
      const deleted_task = tasks.find((element) => element.id === chosen);
      let new_tasks = tasks.map(task => {
        if (task.local_id > deleted_task.local_id) {
          return { ...task, local_id: task.local_id - 1 }
        } else return task;
      });
      new_tasks = new_tasks.filter(task => task.id !== chosen);
      setTasks(new_tasks);
      setLastId(lastId - 1);
    }
  }

  function handleElevation(taskId) {
    const parent = tasks.find((element) => element.local_id === taskId - 1);
    if (taskId !== 1) {
      const new_tasks = tasks.map(task => {
        if (task.local_id === taskId - 1) {
          return { ...task, local_id: taskId }
        } else if (task.local_id === taskId) {
          if (!task.parents.includes(parent.id)) {
            return { ...task, local_id: taskId - 1 }
          } else return { ...task, local_id: taskId - 1, parents: task.parents.filter(obj => obj !== parent.id) }
        } else return task;
      });
      setTasks([].concat(new_tasks)
        .sort((a, b) => a.local_id > b.local_id ? 1 : -1));
    }
  }

  function handleLowering(taskId) {
    const parent = tasks.find((element) => element.local_id === taskId);
    if (taskId !== lastId) {
      const new_tasks = tasks.map(task => {
        if (task.local_id === taskId) {
          return { ...task, local_id: taskId + 1 }
        } else if (task.local_id === taskId + 1) {
          if (!task.parents.includes(parent.id)) {
            return { ...task, local_id: taskId }
          } else return { ...task, local_id: taskId, parents: task.parents.filter(obj => obj !== parent.id) }
        } else return task;
      });
      setTasks([].concat(new_tasks)
        .sort((a, b) => a.local_id > b.local_id ? 1 : -1));
    }
  }

  useEffect(() => {
    if (!saving) {
      (async () => {
        await getTasks();
      })();

      return () => {
      };
    }
  }, [saving]);

  if (saving) return <Stack direction="row" alignItems="center" justifyContent="center"><Typography variant="h2" component="h2">Saving...</Typography></Stack>;
  if (!tasks) return <Stack direction="row" alignItems="center" justifyContent="center"><Typography variant="h2" component="h2">Loading...</Typography></Stack>;


  return (
    <Stack spacing={4} direction="column" alignItems="center" justifyContent="center">
      {
        tasks.map(task => {
          return (
            <Stack key={task.local_id} spacing={4} direction="row" alignItems="center" justifyContent="space-around">
              {editingTasks && (
                <IconButton disabled={!editingTasks} onClick={() => {
                  if (task.id) {
                    handleDialogOpen(task.id)
                  } else {
                    let new_tasks = tasks.filter(obj => obj.local_id !== task.local_id);
                    new_tasks = new_tasks.map(obj => {
                      if (obj.local_id > task.local_id) {
                        return { ...obj, local_id: obj.local_id - 1 }
                      } else return obj;
                    });
                    setTasks(new_tasks);
                    setLastId(lastId - 1);
                  }
                }
                } size="small" color="primary">
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
              <Stack direction="column" alignItems="center" justifyContent="center">
                <IconButton disabled={!editingTasks} onClick={() => handleElevation(task.local_id)} size="small" color="primary">
                  <UpIcon fontSize="small" />
                </IconButton>
                <Typography variant="h6" component="h6">{task.local_id}</Typography>
                <IconButton disabled={!editingTasks} onClick={() => handleLowering(task.local_id)} size="small" color="primary">
                  <DownIcon fontSize="small" />
                </IconButton>
              </Stack>
              <TextField disabled={!editingTasks} required label="Название" value={task.title} onChange={(e) => handleChange(e, task.local_id, 'title')} variant="outlined" />
              <TextField disabled={!editingTasks} type="number" required label="Длительность" value={task.duration} onChange={(e) => handleChange(e, task.local_id, 'duration')} variant="outlined"
                onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()} />
              {/* <TextField required label="Связи" value={task.related_ids} onChange={(e) => handleChange(e, task.local_id, 'ids')} variant="outlined" /> */}
              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="rel_ids">Связи</InputLabel>
                <Select disabled={!editingRelations}
                  labelId="rel_ids"
                  multiple
                  value={task.parents}
                  label="Связи"
                  onChange={(e) => handleChange(e, task.local_id, 'ids')}
                  input={<OutlinedInput label="Name" />}
                >
                  {tasks.map(rel => {
                    return <MenuItem disabled={task.local_id > rel.local_id ? false : true} key={rel.local_id} value={rel.id}>{rel.title}</MenuItem>
                  })}
                </Select>
              </FormControl>
            </Stack>
          )
        })
      }
      <Stack spacing={4} direction="row" alignItems="center" justifyContent="center">
        {!editingTasks && !editingRelations ? (
          <>
            <Button onClick={() => { setEditingTasks(true) }}>Изменить этапы</Button>
            <Button onClick={() => { setEditingRelations(true) }}>Изменить связи</Button>
          </>
        ) : (editingTasks ? (<>
          <Button onClick={handleCreation}>Создать</Button>
          <Button onClick={handleSaving}>Сохранить</Button>
        </>) : (
          <><Button onClick={handleSaving}>Сохранить связи</Button></>
        ))}
      </Stack>
      <ConfirmationDialog open={dialogOpen} onClose={handleDelete}></ConfirmationDialog>
    </Stack >
  )

}