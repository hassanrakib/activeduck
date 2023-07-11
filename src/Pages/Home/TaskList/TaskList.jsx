import React from "react";
import Task from "../Task/Task";
import styles from "./TaskList.module.css";
import { socket } from "../../../socket";

const TaskList = ({ setLastTaskDate }) => {
  // tasksInfo contains the tasks and activeTaskId
  const [tasksInfo, setTasksInfo] = React.useState({
    tasks: [],
    activeTaskId: "",
  });

  React.useEffect(() => {

    // "tasks:read" event listener recieves the tasks and activeTaskId
    function onTasksReadEvent({ tasks, activeTaskId }) {

      // if the tasks that comes from backend is not empty array
      if (tasks.length) {
        // get the last task's utc date string then set the lastTaskDate state in UserStatus component
        setLastTaskDate(tasks[tasks.length - 1].date);
      } else {
        // if tasks is empty array
        // tasks will be empty if no tasks created for today
        // create utc time from current local time set it to the lastTaskDate state
        const utcDateString = new Date().toISOString();

        // set the lastTaskDate state to the current utc date
        setLastTaskDate(utcDateString);
      }

      // set tasksInfo state
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

    // if socket got disconnected while a task was active, we stored endTime in localStorage
    // now, before reading tasks register endTime to workedTimeSpan object of that task
    if (localStorage.endTime) {
      const endTime = JSON.parse(localStorage.endTime);
      socket.emit(
        "workedTimeSpan:end",
        endTime._id,
        endTime.workedTimeSpanId,
        endTime.endTime,
        (response) => {
          console.log(response);
          // if successful in saving the endTime
          // "tasks:change" event is emitted from BE, that is listened by the TaskList component
          // then the TaskList component emits "tasks:read" event to listen "tasks:read" event emitted by BE
          // then by listening "tasks:read", TaskList component sets tasks state
          // so re-render happens to this task as well
          // and we clear activeTaskId to empty string in this process

          // clear the local storage after saving endTime
          localStorage.removeItem("endTime");
        }
      );
    } else {
      // send event to get the tasks of an user for today
      // used query { doer: username, date: { $gte: startOfToday() } } in the backend
      socket.emit("tasks:read");
    }

    // get the tasks from BE
    socket.on("tasks:read", onTasksReadEvent);

    // get the tasks again whenever a task is modified by modifying workedTimeSpans array
    socket.on("tasks:change", onTasksChangeEvent);

    // cleanup event listeners
    return () => {
      socket.off("tasks:read", onTasksReadEvent);
      socket.off("tasks:change", onTasksChangeEvent);
    };
  }, [setLastTaskDate]);

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
