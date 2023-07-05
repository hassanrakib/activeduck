import Button from "../../Shared/Button/Button";
import styles from "./Task.module.css";
import zzz from "../../../assets/zzz.gif";
import Progress from "../Progress/Progress";
import { format } from "date-fns";
import Level from "../Level/Level";
import PlayPauseIcon from "../PlayPauseIcon/PlayPauseIcon";
import TaskSettings from "../TaskSettings/TaskSettings";
import useTaskProgress from "../../../hooks/useTaskProgress";

//** socket disconnection handling is important otherwise endTime property will not be added **//
const Task = ({ task, activeTaskId }) => {

  // destructuring
  const { _id, name, levels, workedTimeSpans } = task;

  // get the necessary calucalated progress for the task
  const { isTaskActive, completedTimeInMilliseconds, isDisconnected, currentLevel } = useTaskProgress(_id, activeTaskId, workedTimeSpans, levels);

  // format workedTimeSpan start time and end time
  function formatSpanTime(time) {
    // start time and end time stored in utc time in db
    // so we have to first convert the utc time to local time using new Date()
    // if time is truthy, because endTime can be undefined
    if (time) {
      // get the utc time string converted to local time
      const localTime = new Date(time);
      // then format to "12:00 AM"
      return format(localTime, "p");
    }

    // if endTime is undefined
    return "";
  }

  return (
    <li className={styles.taskItem}>
      {/* play / pause icon wrapper absolute positioned */}
      <PlayPauseIcon
        task={task}
        activeTaskId={activeTaskId}
        isTaskActive={isTaskActive}
        completedTimeInMilliseconds={completedTimeInMilliseconds}
        isDisconnected={isDisconnected}
      />
      <div className={styles.task}>
        {/* current level */}
        <Level currentLevel={currentLevel} />
        <div className={styles.taskDetailsWrapper}>
          <div className={styles.taskDetails}>
            {/* task name and settings */}
            <div className={styles.taskNameAndSettings}>
              <p>{name}</p>
              <TaskSettings task={task} />
            </div>
            {workedTimeSpans.length === 0 ? (
              // if not worked show image
              <div className={styles.zzzContainer}>
                <img className={styles.zzz} src={zzz} alt="sleeping" />
              </div>
            ) : (
              <div className={styles.timeSpans}>
                {/* show workedTimeSpans */}
                {workedTimeSpans?.map((timeSpan) => (
                  <Button key={Math.random()} className="btnGrayBorder btnSmall">
                    {formatSpanTime(timeSpan.startTime)} -{" "}
                    {formatSpanTime(timeSpan.endTime)}
                  </Button>
                ))}
              </div>
            )}
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
