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
  // tasks and setTasks
  const [tasks, setTasks] = React.useState([]);

  // know the task id that is currently active
  const [activeTaskId, setActiveTaskId] = React.useState("");

  // function that sets activeTaskId state
  // passed this function to the Task component where we call the function
  // and send task's _id and workedTimeSpans array's last element's index
  const setActiveTaskIdFn = (_id, lastTimeSpanIndex) => {
    // if we want to set a task id to the activeTaskId
    // check that it exists in the activeTaskId
    // if exists then remove the task id from the activeTaskId
    if (activeTaskId === _id) {
      // before removing _id from activeTaskId
      // register the end time of a task's last workedTimeSpan obj in workedTimeSpans array
      socket.emit("workedTimeSpan:end", _id, lastTimeSpanIndex, (response) => {
        console.log(response);
        // if successful in saving the endTime
        // clear the activeTaskId
        setActiveTaskId("");
      });

      // or set the task id to the activeTaskId
    } else {
      // push workedTimeSpan obj in workedTimeSpans array 
      // with startTime property set to the current time
      // before setting it as active task
      socket
        .timeout(5000)
        .emit("workedTimeSpan:start", _id, (err, response) => {
          if (err) {
            console.log(err);
          }
          if (response) {
            console.log(response);
            // if response comes that successful insertion of startTime
            // then set activeTaskId
            setActiveTaskId(_id);
          }
        });
    }
  };

  React.useEffect(() => {
    // "tasks:read" event listener
    function onTasksReadEvent(tasks) {
      setTasks(tasks);
    }

    // "tasks:change" event listener emits the "tasks:read" event
    function onTasksChangeEvent() {
      // send event to get the tasks of an user for today
      // used query { doer: username, date: { $gte: startOfToday() } } in the backend
      socket.emit("tasks:read");
    }

    // send event to get the tasks of an user for today
    // used query { doer: username, date: { $gte: startOfToday() } } in the backend
    socket.emit("tasks:read");

    // get the tasks from BE
    socket.on("tasks:read", onTasksReadEvent);

    // get the tasks whenever change happens to tasks collection
    // such as if someone creates a task
    socket.on("tasks:change", onTasksChangeEvent);

    // cleanup event listeners
    return () => {
      socket.off("tasks:read", onTasksReadEvent);
      socket.off("tasks:change", onTasksChangeEvent);
    };
  }, []);

  return (
    <ul className={styles.taskList}>
      {tasks?.map((task) => (
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
