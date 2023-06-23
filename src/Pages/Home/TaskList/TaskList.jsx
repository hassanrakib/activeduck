import React from "react";
import Task from "../Task/Task";
import styles from "./TaskList.module.css";
import { socket } from "../../../socket";

// fake data later use real data
const tasks = [
  {
    _id: 1,
    name: "Study math for 1h",
    workedTimeSpans: [
      // "03:00am - 01:00am",
      // "03:00am - 01:00am",
      // "03:00am - 01:00am",
      // "03:00am - 01:00am",
      // "03:00am - 01:00am",
    ],
    totalTime: "4h 50m",
  },
  {
    _id: 2,
    name: "Study JavaScript coding from day to night",
    workedTimeSpans: [
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
    workedTimeSpans: [
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
  // tasksInfo contains the tasks and activeTaskId
  const [tasksInfo, setTasksInfo] = React.useState({
    tasks: [],
    activeTaskId: "",
  });

  React.useEffect(() => {
    // "tasks:read" event listener recieves the tasks and activeTaskId
    function onTasksReadEvent({ tasks, activeTaskId }) {
      setTasksInfo({ tasks, activeTaskId });
    }

    // "tasks:change" event listener recieves the active task id
    // that we sent to BE during "workedTimeSpan:start" event in the Task component
    // this listener emits the "tasks:read" event and send the activeTaskId
    function onTasksChangeEvent(activeTaskId) {
      // send event to get the tasks of an user for today
      // used query { doer: username, date: { $gte: startOfToday() } } in the backend
      socket.emit("tasks:read", activeTaskId);
    }

    // send event to get the tasks of an user for today
    // used query { doer: username, date: { $gte: startOfToday() } } in the backend
    socket.emit("tasks:read");

    // get the tasks from BE
    socket.on("tasks:read", onTasksReadEvent);

    // get the tasks again whenever a task is modified by modifying workedTimeSpans array
    socket.on("tasks:change", onTasksChangeEvent);

    // cleanup event listeners
    return () => {
      socket.off("tasks:read", onTasksReadEvent);
      socket.off("tasks:change", onTasksChangeEvent);
    };
  }, []);

  React.useEffect(() => {
    // it emits "tasks:read" event with the stored activeTaskId of the state
    // because in the time of creating a new task, another task might be active 
    const onTasksChangeByCreateEvent = () => {
      socket.emit("tasks:read", tasksInfo.activeTaskId);
    };

    // "tasks:change-by-create" event is fired from server when new task is created
    // by listening "tasks:create" event
    socket.on("tasks:change-by-create", onTasksChangeByCreateEvent);

    return () => {
      socket.off("tasks:change-by-create", onTasksChangeByCreateEvent);
    };
  }, [tasksInfo.activeTaskId]);

  return (
    <ul className={styles.taskList}>
      {tasksInfo.tasks?.map((task) => (
        <Task
          key={task._id}
          task={task}
          activeTaskId={tasksInfo.activeTaskId}
        />
      ))}
    </ul>
  );
};

export default TaskList;
