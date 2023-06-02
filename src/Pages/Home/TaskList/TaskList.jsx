import React from "react";
import Task from "../Task/Task";
import styles from "./TaskList.module.css";
// fake data later use real data
const tasks = [
  {
    _id: 1,
    name: "Study math for 1h",
    workedSlots: [
      "03:00am - 01:00am",
      "03:00am - 01:00am",
      "03:00am - 01:00am",
      "03:00am - 01:00am",
      "03:00am - 01:00am",
    ],
    totalTime: "4h 50m",
  },
  {
    _id: 2,
    name: "Study JavaScript coding from day to night",
    workedSlots: [
      "03:00am - 01:00am",
      "03:00am - 01:00am",
      "03:00am - 01:00am",
      "03:00am - 01:00am",
      "03:00am - 01:00am",
    ],
    totalTime: "4h 50m",
  },
  {
    _id: 3,
    name: "Study math for 1h",
    workedSlots: [
      "03:00am - 01:00am",
      "03:00am - 01:00am",
      "03:00am - 01:00am",
      "03:00am - 01:00am",
      "03:00am - 01:00am",
    ],
    totalTime: "4h 50m",
  },
];

const TaskList = () => {
  // know the task id that is currently active
  const [activeTaskId, setActiveTaskId] = React.useState(0);
  const setActiveTaskIdFn = (_id) => {
    if (activeTaskId === _id) {
      setActiveTaskId(0);
    } else {
      setActiveTaskId(_id);
    }
  };
  return (
    <ul className={styles.taskList}>
      {
        tasks.map(task => <Task key={task._id} task={task} activeTaskId={activeTaskId}  setActiveTaskIdFn={setActiveTaskIdFn} />)
      }
    </ul>
  );
};

export default TaskList;
 