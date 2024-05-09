import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid, Typography, IconButton, TextField, Button, Stack, Checkbox } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { edit_analysis, get_analysis } from "../network";

export default function AnalysisView() {
  const { id } = useParams();
  const [code, setCode] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [access, setAccess] = useState(false);
  const [error, setError] = useState(false);
  const [currentId, setCurrentId] = useState(1);

  const handleFetching = async () => {
    const data = await get_analysis(id, code);
    if (data) {
      setAnalysis(data);
      setAccess(true);
    }
    else setError(true);
  }

  const handleAdding = () => {
    if (analysis.cases.length < 10) {
      const caseEl = { 'id': currentId, 'fields': [] };
      analysis.criteria.map(el => {
        caseEl.fields.push({ 'id': el.id, 'type': el.type, 'value': el.type !== "bool" ? "" : false });
      });
      setAnalysis({ ...analysis, cases: [...analysis.cases, caseEl] });
      setCurrentId(currentId + 1);
    }
  }

  useEffect(() => {
    if (access && analysis && analysis.cases.length < 3) {
      handleAdding();
    }
  }, [analysis]);

  const handleChange = (newField, elId) => {
    const newCases = analysis.cases.map(caseEl => {
      if (caseEl.id === elId) {
        caseEl.fields = caseEl.fields?.map(field => {
          if (field.id === newField.id) {
            return newField;
          } else return field;
        });
        return caseEl;
      } else return caseEl;
    });
    setAnalysis({ ...analysis, cases: newCases });
  }

  const basicAnalysis = async () => {
    const newCases = analysis.cases.map(caseEl => {
      let counter = 0;
      let total = 0;
      for (let i = 0; i < caseEl.fields.length; i++) {
        switch (caseEl.fields[i].type) {
          case "bool":
            counter += caseEl.fields[i].value ? analysis.criteria[i].weight : 0;
            break;
          case "number":
            const higher = caseEl.fields[i].value >= analysis.criteria[i].value;
            counter += ((analysis.criteria[i].sign === 1) + higher) % 2 === 0 ? analysis.criteria[i].weight : 0;
            break;
          case "range":
            counter += ((caseEl.fields[i].value >= analysis.criteria[i].lval) && (caseEl.fields[i].value <= analysis.criteria[i].hval)) ? analysis.criteria[i].weight : 0;
            break;
          default:
            break;
        }
        total += caseEl.fields[i].type !== "str" ? analysis.criteria[i].weight : 0;
      }
      console.log(counter, total, counter/total);
      caseEl.result = parseFloat((counter / total).toFixed(3));
      return caseEl;
    });
    const data = { ...analysis, finished: true, cases: newCases };
    setAnalysis(data);
    await edit_analysis(data);
  }


  return (!access ?
    <Stack spacing={2} direction="column" justifyContent="center" alignItems="center" sx={{ height: '100%' }} >
      <Typography variant="h4">Вход</Typography>
      <TextField label="Код доступа" value={code} error={error} onChange={(e) => { setCode(e.target.value); setError(false); }}></TextField>
      <Button variant="outlined" onClick={handleFetching}>Войти</Button>
    </Stack > :
    <Grid container justifyContent='center' spacing={4}>
      <Grid item xs={11} align="center">
        <Stack spacing={2} direction="row" justifyContent="start" alignItems="start" sx={{ height: '100%', mt: 1 }}>
          <Stack spacing={4} direction="column" alignItems="center" sx={{ height: '100%', width: 'max-width' }}>
            <Typography variant="h4">Критерии</Typography>
            <Stack spacing={4} justifyContent="center" alignItems="center" textAlign="center" sx={{ width: '100%' }}>
              {analysis.criteria.map(criteria => {
                return <Stack justifyContent="center" sx={{ height: "56px" }}>
                  <Typography variant="h5">{criteria.title}</Typography>
                  {criteria.type === "number" && <Typography variant="subtitle">{criteria.sign ? "Больше " + criteria.value : "Меньше " + criteria.value}</Typography>}
                  {criteria.type === "range" && <Typography variant="subtitle">{"От " + criteria.lval + " до " + criteria.hval}</Typography>}
                </Stack>
              })}
            </Stack>
          </Stack>
          {analysis.cases.map(caseEl => {
            return <Stack spacing={4} direction="column" alignItems="center" sx={{ height: '100%', width: 'max-width' }}>
              <Typography variant="h4">#{caseEl.id}</Typography>
              {caseEl.fields.map(field => {
                return field.type !== "bool" ?
                  <TextField value={field.value} disabled={analysis.finished} onChange={(e) => {
                    field.value = (field.type === "str") ? e.target.value : parseInt(e.target.value);
                    handleChange(field, caseEl.id);
                  }}
                    type={(field.type !== "str") ? "number" : "text"} onKeyDown={(evt) => (field.type !== "str") && ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()} /> :
                  <Checkbox sx={{ height: "56px" }} disabled={analysis.finished} checked={field.value} onChange={(e) => {
                    field.value = e.target.checked;
                    handleChange(field, caseEl.id);
                  }} />
              })}
              {analysis.finished && <Typography variant="h6">{caseEl.result}</Typography>}
            </Stack>
          })}
          {!analysis.finished &&
            <Stack direction="row">
              {analysis.cases.length < 10 && <IconButton onClick={handleAdding}><AddIcon /></IconButton>}
              <Button onClick={basicAnalysis}>Fuggg</Button>
            </Stack>
          }
        </Stack>
      </Grid>
    </Grid>

  )
}