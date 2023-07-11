import React from "react";
import TimeChart from "../../Shared/TimeChart/TimeChart";
import TaskList from "../TaskList/TaskList";
import UserIntro from "../UserIntro/UserIntro";
import styles from "./UserStatus.module.css";
import { format, isSameYear } from "date-fns";
import { socket } from "../../../socket";
const UserStatus = () => {
  // set the lastTaskDate from the TaskList component
  // this date is the creation date (in utc) of the last task from tasks that are loaded in TaskList component 
  const [lastTaskDate, setLastTaskDate] = React.useState(null);

  // totalCompletedTimes is going to be an array of total completed times of a date range
  // total completed times will be in milliseconds (ex: [103, 2234, 3243243, 463533])
  const [totalCompletedTimes, setTotalCompletedTimes] = React.useState([]);

  // get an array of totalCompletedTimes for a date range
  React.useEffect(() => {
    if (lastTaskDate) {
      // sending lastTaskDate state and days to subtract from the lastTaskDate
      // subtraction will give the start date from where we will collect tasks
      socket.emit("totalCompletedTimes:read", lastTaskDate, 7, (completedTimes) => {
        // set totalCompletedTimes state
        console.log(completedTimes);
        // setTotalCompletedTimes(completedTimes);
      });
    }
  }, [lastTaskDate]);


  // convert the utc date string in lastTaskDate state to local date object
  const localDate = new Date(lastTaskDate);

  // format the localDate object to date string like "10 Jul 2023"
  // but if the localDate contains the year that is the current year then the year is not shown
  const formattedLocalDateString = format(
    localDate,
    `d MMM ${isSameYear(localDate, new Date()) ? "" : "yyy"}`
  )

  return (
    <div className={styles.userStatus}>
      {/* tasks creation date */}
      <div className={styles.date}>{formattedLocalDateString}</div>
      {/* user introduction with total working time */}
      <UserIntro totalCompletedTimes={totalCompletedTimes}/>
      <TaskList setLastTaskDate={setLastTaskDate} />
      <TimeChart />
    </div>
  )
};

export default UserStatus;
