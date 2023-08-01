import Task from "../Task/Task";
import styles from "./TaskList.module.css";

const TaskList = ({tasks, indexInTasksOfDays, activeTaskId}) => {

  return (
    <ul className={styles.taskList}>
      {tasks?.map((task) => (
        <Task
          key={task._id}
          task={task}
          activeTaskId={activeTaskId}
          indexInTasksOfDays={indexInTasksOfDays}
        />
      ))}
    </ul>
  );
};

export default TaskList;
