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
  const [totalCompletedTimeInMs, setTotalCompletedTimeInMs] =
    React.useState(totalCompletedTime);

  // know whether user got disconnected
  const [isDisconnected, setIsDisconnected] = React.useState(false);

  // defines whether any task is active within this <UserStatus /> component
  const isATaskActive = React.useMemo(() => {
    // if any of the tasks _id property matches activeTaskId return true otherwise false
    return !!tasks.find((task) => task._id === activeTaskId);
  }, [tasks, activeTaskId]);

  // update totalCompletedTimeInMs state after re-render and change of totalCompletedTime prop
  React.useEffect(() => {
    setTotalCompletedTimeInMs(totalCompletedTime);
  }, [totalCompletedTime]);

  React.useEffect(() => {
    // add connect event listener to know when the socket is connected again
    const onConnect = () => {
      // set isDisconnected state to false if it was true before
      if (isDisconnected) {
        setIsDisconnected(false);
      }
    };
    socket.on("connect", onConnect);
    // cleanup
    return () => {
      socket.off("connect", onConnect);
    };
  }, [isDisconnected]);

  React.useEffect(() => {
    // "workedTimeSpan:continue" event listener
    function onWorkedTimeSpanContinue(startTime, endTime) {
      const timeDifference = getTimeDifferenceInMilliseconds(
        startTime,
        endTime
      );

      // add the timeDifference to the totalCompletedTime and set the totalCompletedTimeInMs state
      setTotalCompletedTimeInMs(totalCompletedTime + timeDifference);
    }

    // "disconnect" event listener
    function onDisconnect() {
      // set isDisconnected state to true
      setIsDisconnected(true);
      // clean the event listener
      socket.off("workedTimeSpan:continue", onWorkedTimeSpanContinue);
    }

    // register "workedTimeSpan:continue" event listener to calculate the time difference
    // in millisecond of the active task's last workedTimeSpan object's startTime and endTime
    // when any of the tasks is active
    if (isATaskActive) {
      socket.on("workedTimeSpan:continue", onWorkedTimeSpanContinue);

      // if user gets disconnected
      socket.on("disconnect", onDisconnect);
    }

    // if no task is active
    if (!isATaskActive) {
      // cleanup
      socket.off("workedTimeSpan:continue", onWorkedTimeSpanContinue);
      socket.off("disconnect", onDisconnect);
    }

    // cleanup
    return () => {
      socket.off("workedTimeSpan:continue", onWorkedTimeSpanContinue);
      socket.off("disconnect", onDisconnect);
    };
  }, [totalCompletedTime, isATaskActive]);

  return (
    <div className={styles.userIntro}>
      {/* user image */}
      <Avatar image={userImage} />
      {/* user name and worked time*/}
      <p className={styles.userName}>
        <b>@{user?.username}</b> worked for{" "}
        <GiSandsOfTime
          color="blueviolet"
          className={isATaskActive && !isDisconnected ? styles.spin : ""}
        />{" "}
        {/* convertToHumanReadableTime converts time in milliseconds to human readable time */}
        <span className={styles.totalTime}>
          {convertToHumanReadableTime(totalCompletedTimeInMs)}
        </span>
      </p>
    </div>
  );
};

export default UserIntro;
