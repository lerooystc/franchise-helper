import React from "react";
import { Chart } from "react-google-charts";

function daysToMilliseconds(days) {
  return days * 24 * 60 * 60 * 1000;
}



const Gantt = (props) => {

  const columns = [
    { type: "string", label: "Task ID" },
    { type: "string", label: "Task Name" },
    { type: "date", label: "Start Date" },
    { type: "date", label: "End Date" },
    { type: "number", label: "Duration" },
    { type: "number", label: "Percent Complete" },
    { type: "string", label: "Dependencies" },
  ];

  // const rows = [
  //   [
  //     "1",
  //     "1st",
  //     new Date(2015, 0, 1),
  //     null,
  //     daysToMilliseconds(1),
  //     100,
  //     null,
  //   ],
  //   [
  //     "2",
  //     "2nd",
  //     null,
  //     null,
  //     daysToMilliseconds(3),
  //     25,
  //     "1",
  //   ],
  //   [
  //     "3",
  //     "3rd",
  //     null,
  //     null,
  //     daysToMilliseconds(3),
  //     25,
  //     "1,2",
  //   ],

  // ];

  const rows = [];

  [].concat(props.tasks)
    .sort((a, b) => a.local_id > b.local_id ? 1 : -1)
    .map(task => {
      rows.push([
        task.id.toString(), task.title, null,
        null,
        daysToMilliseconds(task.duration),
        0,
        (task.parents ? task.parents.toString() : null),
      ])
    });
  
  rows[0][2] = new Date(props.start_date);
  const data = [columns, ...rows];

  return (<Chart
    chartType="Gantt"
    data={data}
    width="100%"
    height={(rows.length * 42 + 60).toString() + "px"}
  />)
}

export default Gantt;