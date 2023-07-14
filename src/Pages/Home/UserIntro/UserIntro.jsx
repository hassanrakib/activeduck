import styles from "./UserIntro.module.css";
import userImage from "../../../assets/user.png";
import { GiSandsOfTime } from "react-icons/gi";
import Avatar from "../../Shared/Avatar/Avatar";
import useAuth from "../../../hooks/useAuth";
import convertToHumanReadableTime from "../../../lib/convertToHumanReadableTime";
import React from "react";
import { socket } from "../../../socket";
import getTimeDifferenceInMilliseconds from "../../../lib/getTimeDifferenceInMilliseconds";

// first time it will be undefined as totalCompletedTimes state in the UserStatus will be empty
// as first time totalCompletedTime will be undefined, so we give it a default value of 0 
const UserIntro = ({ totalCompletedTime = 0 }) => {
  // get the user from the context
  const { user } = useAuth();

  // state that holds totalCompletedTime for the all the tasks loaded
  // in the <TaskList /> child of the UserStatus parent
  const [totalCompletedTimeInMs, setTotalCompletedTimeInMs] = React.useState(totalCompletedTime);

  // keeping the totalCompletedTime prop to the totalCompletedTimeInMs state
  React.useEffect(() => {
    // when totalCompletedTime anything other than falsy value, set totalCompletedTimeInMs state
    // with totalCompletedTime
    if (totalCompletedTime) {
      setTotalCompletedTimeInMs(totalCompletedTime);
    }
  }, [totalCompletedTime]);

  React.useEffect(() => {
    // register "workedTimeSpan:continue" event listener to calculate the time difference
    // in millisecond of the active task's last workedTimeSpan object's startTime and endTime
    socket.on("workedTimeSpan:continue", (startTime, endTime) => {
      const timeDifference = getTimeDifferenceInMilliseconds(startTime, endTime);

      // add the timeDifference to the totalCompletedTime and set the totalCompletedTimeInMs state
      setTotalCompletedTimeInMs(totalCompletedTime + timeDifference);
    })
  }, [totalCompletedTime]);

  return (
    <div className={styles.userIntro}>
      {/* user image */}
      <Avatar image={userImage} />
      {/* user name and worked time*/}
      <p className={styles.userName}>
        <b>@{user?.username}</b> worked for <GiSandsOfTime color="blueviolet" />{" "}
        {/* convertToHumanReadableTime converts time in milliseconds to human readable time */}
        <span className={styles.totalTime}>{convertToHumanReadableTime(totalCompletedTimeInMs)}</span>
      </p>
    </div>
  );
};

export default UserIntro;
