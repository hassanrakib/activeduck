import React from "react";
import Task from "../Task/Task";
import styles from "./TaskList.module.css";
import { socket } from "../../../socket";
import useAuth from "../../../hooks/useAuth";
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
  const { user } = useAuth();

  // know the task id that is currently active
  const [activeTaskId, setActiveTaskId] = React.useState(0);

  // function that sets activeTaskId state
  // passed it to the Task component where we set the active task id
  const setActiveTaskIdFn = (_id) => {
    // if we want to set a task id to the activeTaskId
    // check that it exists in the activeTaskId
    // if exists then remove the task id from the activeTaskId
    if (activeTaskId === _id) {
      setActiveTaskId("");
      // or set the task id to the activeTaskId
    } else {
      setActiveTaskId(_id);
    }
  };

  React.useEffect(() => {
    // get the tasks of an user for today
    socket.emit("tasks:read", user);
  }, [user]);

  return (
    <ul className={styles.taskList}>
      {tasks.map((task) => (
        <Task
          key={task._id}
          task={task}
          activeTaskId={activeTaskId}
          setActiveTaskIdFn={setActiveTaskIdFn}
        />
      ))}
    </ul>
  );
};

export default TaskList;
