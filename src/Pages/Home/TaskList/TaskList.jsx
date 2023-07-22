import Task from "../Task/Task";
import styles from "./TaskList.module.css";

const TaskList = ({tasksOfADay, indexInTasksOfDays}) => {

  const {tasks} = tasksOfADay;

  // React.useEffect(() => {
  //   // it emits "tasks:read" event with the stored activeTaskId from the state
  //   // because in the time of creating a new task, another task might be active
  //   const onTasksChangeByCreateEvent = () => {
  //     socket.emit("tasks:read", startOfTodayString, tasksInfo.activeTaskId);
  //   };

  //   // "tasks:change-by-create" event is fired from server when new task is created
  //   // by listening "tasks:create" event
  //   socket.on("tasks:change-by-create", onTasksChangeByCreateEvent);

  //   return () => {
  //     socket.off("tasks:change-by-create", onTasksChangeByCreateEvent);
  //   };
  // }, [tasksInfo.activeTaskId, startOfTodayString]);

  return (
    <ul className={styles.taskList}>
      {tasks?.map((task) => (
        <Task
          key={task._id}
          task={task}
          // accomplish this
          // activeTaskId={task.activeTaskId}
          // remove this
          activeTaskId=''
          indexInTasksOfDays={indexInTasksOfDays}
        />
      ))}
    </ul>
  );
};

export default TaskList;
