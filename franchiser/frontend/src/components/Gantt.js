import React from "react";
import { Chart } from "react-google-charts";

function daysToMilliseconds(days) {
  return days * 24 * 60 * 60 * 1000;
}

const columns = [
  { type: "string", label: "Task ID" },
  { type: "string", label: "Task Name" },
  { type: "date", label: "Start Date" },
  { type: "date", label: "End Date" },
  { type: "number", label: "Duration" },
  { type: "number", label: "Percent Complete" },
  { type: "string", label: "Dependencies" },
];

const rows = [
  [
    "Research",
    "Find sources",
    new Date(2015, 0, 1),
    new Date(2015, 0, 5),
    null,
    100,
    null,
  ],
  [
    "Write",
    "Write paper",
    null,
    new Date(2015, 0, 9),
    daysToMilliseconds(3),
    25,
    "Research",
  ],
  [
    "Cite",
    "Create bibliography",
    null,
    new Date(2015, 0, 7),
    daysToMilliseconds(1),
    20,
    "Research",
  ],
  [
    "Complete",
    "Hand in paper",
    null,
    new Date(2015, 0, 10),
    daysToMilliseconds(1),
    0,
    "Cite,Write",
  ],
  [
    "Outline",
    "Outline paper",
    null,
    new Date(2015, 0, 6),
    daysToMilliseconds(1),
    100,
    "Research",
  ],
  [
    "se1",
    "Find sources1",
    new Date(2015, 0, 10),
    new Date(2015, 0, 11),
    null,
    100,
    "Research",
  ],
  [
    "se2",
    "a",
    null,
    new Date(2015, 0, 14),
    daysToMilliseconds(3),
    25,
    "se1",
  ],
  [
    "se3",
    "Create bibliography",
    null,
    new Date(2015, 0, 13),
    daysToMilliseconds(1),
    20,
    "se1",
  ],
  [
    "4",
    "Hand in paper",
    null,
    new Date(2015, 0, 15),
    daysToMilliseconds(1),
    0,
    "se2,se3",
  ],
  [
    "5",
    "Outline paper",
    null,
    new Date(2015, 0, 16),
    daysToMilliseconds(1),
    100,
    "se1",
  ],
];

// for (let index = 10; index < 30; index++) {
//   rows.push([
//     index.toString(), index.toString(), null,
//     new Date(2015, 0, 30),
//     daysToMilliseconds(1),
//     100,
//     "se1",
//   ])
// }

export const data = [columns, ...rows];

const Gantt = (props) => {
  return (<Chart
    chartType="Gantt"
    data={data}
    width="100%"
    height={(rows.length * 42 + 60).toString() + "px"}
  />)
}

export default Gantt;