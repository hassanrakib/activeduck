import React from "react";
import { FiPlayCircle } from "react-icons/fi";
import { FiPauseCircle } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import Button from "../../Shared/Button/Button";
import styles from "./Task.module.css";
import zzz from "../../../assets/zzz.gif";
import Progress from "../Progress/Progress";
import { socket } from "../../../socket";
import { format } from "date-fns";

const Task = ({
  task: { _id, name, workedTimeSpans },
  activeTaskId,
  setActiveTaskIdFn,
}) => {
  // format workedTimeSpan start time and end time
  function formatSpanTime(time) {
    // start time and end time stored in utc time in db
    // so we have to first convert the utc time to local time using new Date()
    // if time is truthy, because endTime can be undefined
    if (time) {
      // get the utc time converted to local time
      const localTime = new Date(`${time}`);
      // then format to "12:00 AM"
      return format(localTime, "p");
    }

    // if endTime is undefined
    return "";
  }

  React.useEffect(() => {
    let interval;
    // if activeTaskId is the _id of a task
    if (activeTaskId === _id) {
      interval = setInterval(() => {
        // ping the server every one second
        // so that, server sends back the updated time
        socket.emit("workedTimeSpan:continue");
      }, 1000);
    }

    // when active task id not equal to a task's _id
    if (!(activeTaskId === _id)) {
      // clear the timer
      return () => clearInterval(interval);
    }

    // cleanup before unmounts
    return () => clearInterval(interval);
  }, [activeTaskId, _id]);

  return (
    <li className={styles.taskItem}>
      {/* play / pause icon wrapper absolute positioned */}
      <div className={styles.iconWrapper}>
        <div
          className={styles.iconContainer}
          // set activeTaskId state
          onClick={() => setActiveTaskIdFn(_id)}
        >
          {/* when the task is active, spin the border */}
          {/* it is covering the icon container and have a dashed border*/}
          <div
            className={`${styles.iconBorder}${
              activeTaskId === _id ? ` ${styles.spin}` : ""
            }`}
          ></div>
          {activeTaskId === _id ? (
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
          <Progress activeTaskId={activeTaskId} _id={_id} />
        </div>
      </div>
    </li>
  );
};

export default Task;
