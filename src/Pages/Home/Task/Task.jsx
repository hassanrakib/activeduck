import Button from "../../Shared/Button/Button";
import styles from "./Task.module.css";
import zzz from "../../../assets/zzz.gif";
import Progress from "../Progress/Progress";
import { format } from "date-fns";
import Level from "../Level/Level";
import PlayPauseIcon from "../PlayPauseIcon/PlayPauseIcon";
import { socket } from "../../../socket";
import TaskSettings from "../TaskSettings/TaskSettings";

//** socket disconnection handling is important otherwise endTime property will not be added **//
const Task = ({ task, activeTaskId }) => {

  // destructuring
  const { _id, name, levels, workedTimeSpans } = task;

  //  if the current activeTaskId equals to this task's _id, that means the task is active
  const isTaskActive = _id === activeTaskId;

  // before calculating and setting completedTimeBeforeTaskActiveRef in withTaskProgressCalculation HOC
  // workedTimeSpans last element may not have its endTime property
  // because user may delete endTime from localStorage that was saved when user got
  // disconnected while doing a task, so we havn't been able to register endTime and
  // and set tasks in TaskList component
  // instead we set tasks only, skipping the registering endTime part in the TaskList

  // if task is not active, endTime should exist
  // even then, if endTime doesn't exist => we will delete that workedTimeSpan object with no
  // endTime
  if (!isTaskActive) {
    // get the last workedTimeSpan object
    const lastWorkedTimeSpan = workedTimeSpans[workedTimeSpans.length - 1];
    // if lastWorkedTimeSpan.endTime is undefined, delete that from workedTimeSpans array
    if (lastWorkedTimeSpan && !lastWorkedTimeSpan.endTime) {
      console.log("hit delete");
      socket.emit("workedTimeSpan:delete", _id);
      // and return to avoid rendering of the Task
      // because execution will cause bug of getting unefined for the lastWorkedTimeSpan.endTime
      // in withTaskProgressCalculation HOC
      return null;
    }
  }
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
        isTaskActive={isTaskActive}
        workedTimeSpans={workedTimeSpans}
        levels={levels}
        activeTaskId={activeTaskId}
        _id={_id}
      />
      <div className={styles.task}>
        {/* current level */}
        <Level
          isTaskActive={isTaskActive}
          workedTimeSpans={workedTimeSpans}
          levels={levels}
          activeTaskId={activeTaskId}
          _id={_id}
        />
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
            isTaskActive={isTaskActive}
            workedTimeSpans={workedTimeSpans}
            levels={levels}
            activeTaskId={activeTaskId}
            _id={_id}
          />
        </div>
      </div>
    </li>
  );
};

export default Task;
