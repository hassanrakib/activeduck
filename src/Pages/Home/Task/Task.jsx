import { BsThreeDots } from "react-icons/bs";
import Button from "../../Shared/Button/Button";
import styles from "./Task.module.css";
import zzz from "../../../assets/zzz.gif";
import Progress from "../Progress/Progress";
import { format } from "date-fns";
import Level from "../Level/Level";
import PlayPauseIcon from "../PlayPauseIcon/PlayPauseIcon";

//** socket disconnection handling is important otherwise endTime property will not be added **//
const Task = ({ task, activeTaskId }) => {
  // destructuring
  const { _id, name, levels, workedTimeSpans } = task;

  //  if the current activeTaskId equals to this task's _id, that means the task is active
  const isTaskActive = _id === activeTaskId;

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
        />
        <div className={styles.taskDetailsWrapper}>
          <div className={styles.taskDetails}>
            <div className={styles.taskNameAndSettings}>
              <p>{name}</p>
              <BsThreeDots className={styles.taskSettings} />
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
                  <Button key={Math.random()} className="timeSpan">
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
          />
        </div>
      </div>
    </li>
  );
};

export default Task;
