import { FiPlayCircle } from "react-icons/fi";
import { FiPauseCircle } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import Button from "../../Shared/Button/Button";
import styles from "./Task.module.css";
import zzz from "../../../assets/zzz.gif";
import Progress from "../Progress/Progress";
import { socket } from "../../../socket";
import { format } from "date-fns";

//** socket disconnection handling is important otherwise endTime property will not be added **//
const Task = ({ task, activeTaskId }) => {
  // destructuring
  const { _id, name, levels, workedTimeSpans } = task;

  // last time span object's index in workedTimeSpans array of the task
  const lastTimeSpanIndex = workedTimeSpans.length - 1;

  //  if the current activeTaskId equals to this task's _id, that means the task is active
  const isTaskActive = _id === activeTaskId;

  // function that registers startTime and endTime property to a workedTimeSpan in workedTimeSpans array
  // used this function as onClick handler of the play pause icon container
  // and send task's _id and workedTimeSpans array's last element's index
  const addWorkedTimeSpan = (_id, lastTimeSpanIndex) => {
    // if the task is active
    // we need to set the endTime property to the last time span object in workedTimeSpans array
    if (isTaskActive) {
      // register the end time to a task's last workedTimeSpan obj in workedTimeSpans array
      return socket.emit(
        "workedTimeSpan:end",
        _id,
        lastTimeSpanIndex,
        (response) => {
          console.log(response);
          // if successful in saving the endTime
          // "tasks:change" event is emitted from BE, that is listened by the TaskList component
          // then the TaskList component emits "tasks:read" event to listen "tasks:read" event emitted by BE
          // then by listening "tasks:read", TaskList component sets tasks state
          // so re-render happens to this task as well
          // and we clear activeTaskId to empty string in this process
        }
      );
    }

    // first check that any other task is active or not
    // if not active activeTaskId is empty string
    // so we can activate the task
    if (!activeTaskId) {
      // push workedTimeSpan obj in workedTimeSpans array
      // with startTime property set to the current time
      // no endTime property

      // here we send _id to the "workedTimeSpan:start" listener in the backend
      // "workedTimeSpan:start" listener recieves and send _id as activeTaskId
      // with "tasks:change" event to the client side
      // "tasks:change" is listened in the TaskList component that finally does re-render of the
      // tasks and we get activeTaskId
      socket
        .timeout(5000)
        .emit("workedTimeSpan:start", _id, (err, response) => {
          if (err) {
            console.log(err);
          }
          if (response) {
            console.log(response);
          }
        });
    }
  };

  
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
      <div className={styles.iconWrapper}>
        <div
          className={styles.iconContainer}
          // add workedTimeSpan to workedTimeSpans array
          // and send _id of the task also the last element's index
          onClick={() => addWorkedTimeSpan(_id, lastTimeSpanIndex)}
        >
          {/* when the task is active, means lastWorkedTimeSpan doesn't have endTime => spin the border */}
          {/* it is covering the icon container and have a dashed border*/}
          <div
            className={`${styles.iconBorder}${
              isTaskActive ? ` ${styles.spin}` : ""
            }`}
          ></div>
          {isTaskActive ? (
            <FiPauseCircle
              size="1.5em"
              color="blueviolet"
              className={styles.icon}
            />
          ) : (
            <FiPlayCircle
              size="1.5em"
              color="#a5a5a5"
              className={styles.icon}
            />
          )}
        </div>
      </div>
      <div className={styles.task}>
        {/* current level */}
        <div className={styles.currentLevel}>
          <span>Level - 1</span>
        </div>
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
          />
        </div>
      </div>
    </li>
  );
};

export default Task;
