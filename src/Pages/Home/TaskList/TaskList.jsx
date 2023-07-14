import React from "react";
import Task from "../Task/Task";
import styles from "./TaskList.module.css";
import { socket } from "../../../socket";
import { startOfToday } from "date-fns";

const TaskList = ({ setLastTaskDate }) => {
  // to show tasks that are created only today
  // create a utc date string that is the start of today
  const startOfTodayString = startOfToday().toISOString();


  // tasksInfo contains the tasks and activeTaskId
  const [tasksInfo, setTasksInfo] = React.useState({
    tasks: [],
    activeTaskId: "",
  });

  React.useEffect(() => {

    // "tasks:read" event listener recieves the tasks and activeTaskId
    // it is called whenever there is any change in the tasks collection
    function onTasksReadEvent({ tasks, activeTaskId }) {

      // if the tasks that comes from backend is not an empty array
      // set the lastTaskDate state in UserStatus component
      // with an object whose taskDate property set to the last task's utc date string
      // activeTaskId property set to the current active task's id
      // we will use it to spin the sand glass icon in the UserIntro component

      // also, lastTaskDate state's activeTaskId has another benifit
      // when you start doing a task, you set lastTaskDate
      // when you stop doing a task, you set lastTaskDate
      // activeTaskId makes the lastTaskDate state to be different after every setLastTaskDate function call
      // otherwise setting lastTaskDate wouldn't change the lastTaskDate state
      // (without activeTaskId property, it is just taskDate which is last task's utc date string)
      // (last task's utc date string always the same no matter you start or stop doing a task)
      // (taskDate only changes when new task is created)
      // as a result we wouldn't get updated totalCompletedTimes state after we stop doing a task
      // it is needed to get updated totalCompletedTimes, because we send the last totalCompletedTime
      // object's completed time to the UserIntro component to add timeDifference of the active workedTimeSpan
      // to show the completedTime of the tasks for today

      setLastTaskDate({ taskDate: tasks[tasks.length - 1].date, activeTaskId });

      // set tasksInfo state
      setTasksInfo({ tasks, activeTaskId });
    }

    // "tasks:change" event listener recieves the active task id
    // that we sent to BE during "workedTimeSpan:start" event in the Task component
    // this listener emits the "tasks:read" event and send the activeTaskId
    function onTasksChangeEvent(activeTaskId) {
      // send event to get the tasks of an user for today
      // used query { doer: username, date: { $gte: new Date(startOfTodayString) } } in the backend
      socket.emit("tasks:read", startOfTodayString, activeTaskId);
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
      // used query { doer: username, date: { $gte: new Date(startOfTodayString) } } in the backend
      socket.emit("tasks:read", startOfTodayString);
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
  }, [setLastTaskDate, startOfTodayString]);

  React.useEffect(() => {
    // it emits "tasks:read" event with the stored activeTaskId from the state
    // because in the time of creating a new task, another task might be active
    const onTasksChangeByCreateEvent = () => {
      socket.emit("tasks:read", startOfTodayString, tasksInfo.activeTaskId);
    };

    // "tasks:change-by-create" event is fired from server when new task is created
    // by listening "tasks:create" event
    socket.on("tasks:change-by-create", onTasksChangeByCreateEvent);

    return () => {
      socket.off("tasks:change-by-create", onTasksChangeByCreateEvent);
    };
  }, [tasksInfo.activeTaskId, startOfTodayString]);

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
