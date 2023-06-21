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

  // get user
  const { user } = useAuth();

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
      // register the end time of a task's workedTimeSpan obj in workedTimeSpans array
      socket.emit("workedTimeSpan:end", _id, lastTimeSpanIndex, (response) => {
        console.log(response);
        // if successful in saving the endTime
        // clear the activeTaskId
        setActiveTaskId("");
      });

      // or set the task id to the activeTaskId
    } else {
      // register the start time of a task's workedTimeSpan into db
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
    // get the tasks of an user for today
    socket.emit("tasks:read", { doer: user?.username });

    // get the tasks from BE
    socket.on("tasks:read", (tasks) => {
      // set the tasks to the tasks state
      setTasks(tasks);
    });
  }, [user]);

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
