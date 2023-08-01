import styles from "./UserIntro.module.css";
import userImage from "../../../assets/user.png";
import { GiSandsOfTime } from "react-icons/gi";
import Avatar from "../../Shared/Avatar/Avatar";
import useAuth from "../../../hooks/useAuth";
import convertToHumanReadableTime from "../../../lib/convertToHumanReadableTime";
import React from "react";
import { socket } from "../../../socket";
import getTimeDifferenceInMilliseconds from "../../../lib/getTimeDifferenceInMilliseconds";

const UserIntro = ({ totalCompletedTime, tasks, activeTaskId }) => {
  
  // get the user from the context
  const { user } = useAuth();

  // initialize totalCompletedTimeInMs state with totalCompletedTime prop
  // as we will need to change totalCompletedTime
  const [totalCompletedTimeInMs, setTotalCompletedTimeInMs] = React.useState(totalCompletedTime);

  // isATaskActive state determines whether spin the sand glass icon
  // const [isATaskActive, setIsATaskActive] = React.useState(false);

  // know whether user got disconnected
  const [isDisconnected, setIsDisconnected] = React.useState(false);

  const isATaskActive = React.useMemo(() => {
    // comment here
    return !!(tasks.find(task => task._id === activeTaskId));
  }, [tasks, activeTaskId]);

  React.useEffect(() => {
    function onWorkedTimeSpanContinue(startTime, endTime) {
      const timeDifference = getTimeDifferenceInMilliseconds(startTime, endTime);

      // add the timeDifference to the totalCompletedTime and set the totalCompletedTimeInMs state
      setTotalCompletedTimeInMs(totalCompletedTime + timeDifference);
    }
    // register "workedTimeSpan:continue" event listener to calculate the time difference
    // in millisecond of the active task's last workedTimeSpan object's startTime and endTime
    // when any of the tasks is active
    if (isATaskActive) {
      socket.on("workedTimeSpan:continue", onWorkedTimeSpanContinue);

      // if user gets disconnected
      socket.on("disconnect", () => {
        // set isDisconnected state to true
        setIsDisconnected(true);
        // clean the event listener
        socket.off("workedTimeSpan:continue", onWorkedTimeSpanContinue);
      });

      // if user gets reconnected
      socket.on("connect", () => {
        // set isDisconnected state to false
        setIsDisconnected(false);
      })
    }

    // if no task is active
    if (!isATaskActive) {
      // cleanup
      socket.off("workedTimeSpan:continue", onWorkedTimeSpanContinue);
    }

    // cleanup
    return () => {
      socket.off("workedTimeSpan:continue", onWorkedTimeSpanContinue);
      socket.off("disconnected");
      socket.off("connect");
    }
  }, [totalCompletedTime, isATaskActive]);

  return (
    <div className={styles.userIntro}>
      {/* user image */}
      <Avatar image={userImage} />
      {/* user name and worked time*/}
      <p className={styles.userName}>
        <b>@{user?.username}</b> worked for {" "}
        <GiSandsOfTime
          color="blueviolet"
          className={isATaskActive && !isDisconnected ? styles.spin : ""}
        />{" "}
        {/* convertToHumanReadableTime converts time in milliseconds to human readable time */}
        <span className={styles.totalTime}>{convertToHumanReadableTime(totalCompletedTimeInMs)}</span>
      </p>
    </div>
  );
};

export default UserIntro;
