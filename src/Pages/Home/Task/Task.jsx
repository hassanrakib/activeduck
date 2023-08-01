import styles from "./Task.module.css";
import zzz from "../../../assets/zzz.gif";
import Progress from "../Progress/Progress";
import Level from "../Level/Level";
import PlayPauseIcon from "../PlayPauseIcon/PlayPauseIcon";
import TaskSettings from "../TaskSettings/TaskSettings";
import useTaskProgress from "../../../hooks/useTaskProgress";
import WorkedTimeSpans from "../WorkedTimeSpans/WorkedTimeSpans";

const Task = ({ task, activeTaskId, indexInTasksOfDays }) => {

  // destructuring
  const { _id, name, levels, workedTimeSpans } = task;

  // get the necessary calucalated progress for the task
  const { isTaskActive, completedTimeInMilliseconds, isDisconnected, currentLevel } = useTaskProgress(_id, activeTaskId, indexInTasksOfDays, workedTimeSpans, levels);


  return (
    <li className={styles.taskItem}>
      {/* play / pause icon wrapper absolute positioned */}
      <PlayPauseIcon
        task={task}
        activeTaskId={activeTaskId}
        isTaskActive={isTaskActive}
        completedTimeInMilliseconds={completedTimeInMilliseconds}
        isDisconnected={isDisconnected}
        indexInTasksOfDays={indexInTasksOfDays}
      />
      <div className={styles.task}>
        {/* current level */}
        <Level currentLevel={currentLevel} />
        <div className={styles.taskDetailsWrapper}>
          <div className={styles.taskDetails}>
            {/* task name and settings */}
            <div className={styles.taskNameAndSettings}>
              <p>{name}</p>
              <TaskSettings
                task={task}
                currentLevel={currentLevel}
                completedTimeInMilliseconds={completedTimeInMilliseconds}
                isTaskActive={isTaskActive}
                indexInTasksOfDays={indexInTasksOfDays}
              />
            </div>
            {workedTimeSpans.length === 0 ? (
              // if not worked show image
              <div className={styles.zzzContainer}>
                <img className={styles.zzz} src={zzz} alt="sleeping" />
              </div>
            ) : <WorkedTimeSpans workedTimeSpans={workedTimeSpans} />}
          </div>
          {/* progress bar */}
          <Progress
            levels={levels}
            completedTimeInMilliseconds={completedTimeInMilliseconds}
            isTaskActive={isTaskActive}
            currentLevel={currentLevel}
            isDisconnected={isDisconnected}
          />
        </div>
      </div>
    </li>
  );
};

export default Task;
