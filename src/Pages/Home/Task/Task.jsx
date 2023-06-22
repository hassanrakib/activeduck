import React from "react";
import { FiPlayCircle } from "react-icons/fi";
import { FiPauseCircle } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import Button from "../../Shared/Button/Button";
import styles from "./Task.module.css";
import zzz from "../../../assets/zzz.gif";
import Progress from "../Progress/Progress";
import { socket } from "../../../socket";
import { differenceInMilliseconds, format } from "date-fns";

const Task = ({
  task: { _id, name, workedTimeSpans },
  activeTaskId,
  setActiveTaskIdFn,
}) => {
  // completedTimeInMillisecondsRef is the object, in its current property
  // we will store the calculated completed time in milliseconds from workedTimeSpans array
  const completedTimeInMillisecondsRef = React.useRef(0);

  // last workedTimeSpan object
  const lastWorkedTimeSpan = workedTimeSpans[workedTimeSpans.length - 1];

  // calculate the completed time in milliseconds from workedTimeSpans array
  // we have to store it in completedTimeInMillisecondsRef.current
  // so that it is not lost between renders
  // also, i don't want the change of completed time to cause re-renders
  completedTimeInMillisecondsRef.current = workedTimeSpans.reduce(
    (completedTime, timeSpan) => {
      // timeSpan is an object like {startTime: "utc date string", endTime: "utc date string"};

      // converts utc date string to the date object
      const startTime = new Date(timeSpan.startTime);

      // lastWorkedTimeSpan.endTime can be undefined
      // if undefined then that means the timeSpan is in not yet ended
      // timeSpan is in progress, 
      // so we don't calculate further instead return completedTime that has been calculated
      if (!timeSpan.endTime) return completedTime;

      // converts utc date string to the date object
      const endTime = new Date(timeSpan.endTime);

      // get the time difference between startTime and endTime in milliseconds
      // for every timeSpan we are getting time difference and adding it to the completedTime
      // finally we get one returned value by the reduce method
      const timeDifference = differenceInMilliseconds(endTime, startTime);

      // add timeDifference to completedTime
      // initial completedTime is 0
      return completedTime + timeDifference;
    },
    0
  );

  console.log("before start", completedTimeInMillisecondsRef.current);

  React.useEffect(() => {
    // register the listener of the "workedTimeSpan:continue" event
    function onWorkedTimeSpanContinue(endTime) {
      // calculate the last workedTimeSpan object's time difference between startTime and endTime
      // though endTime is not yet added to the object as it is in progress
      // we get the endTime by listening to the "workedTimeSpan:continue" event
      const startTime = new Date(lastWorkedTimeSpan.startTime);
      const inProgressEndTime = new Date(endTime);
      const timeDifference = differenceInMilliseconds(
        inProgressEndTime,
        startTime
      );

      // update the completedTimeInMillisecondsRef.current
      completedTimeInMillisecondsRef.current += timeDifference;
      console.log("after start", timeDifference);
    }

    let interval;
    // if activeTaskId is the _id of a task
    if (activeTaskId === _id) {
      interval = setInterval(() => {
        // ping the server every one second
        // so that, server sends back the end time
        socket.emit("workedTimeSpan:continue");
      }, 1000);

      // "workedTimeSpan:continue"
      socket.on("workedTimeSpan:continue", onWorkedTimeSpanContinue);
    }

    // when active task id not equal to a task's _id
    if (!(activeTaskId === _id)) {
      return () => {
        // cleanup the listener
        socket.off("workedTimeSpan:continue", onWorkedTimeSpanContinue);

        // clear the timer
        clearInterval(interval);
      };
    }

    // cleanup before unmounts
    return () => {
      // cleanup the listener
      socket.off("workedTimeSpan:continue", onWorkedTimeSpanContinue);

      // clear the timer
      clearInterval(interval);
    };
  }, [_id, activeTaskId, lastWorkedTimeSpan]);

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
          // set activeTaskId state
          // and send _id of the task also the last element's index in the workedTimeSpans array
          onClick={() => setActiveTaskIdFn(_id, workedTimeSpans.length - 1)}
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
