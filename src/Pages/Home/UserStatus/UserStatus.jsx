import React from "react";
import TimeChart from "../../Shared/TimeChart/TimeChart";
import TaskList from "../TaskList/TaskList";
import UserIntro from "../UserIntro/UserIntro";
import styles from "./UserStatus.module.css";
import { format, isSameYear } from "date-fns";
const UserStatus = () => {
  // get an array of completedTimes for a date range (ex: last 7 days completedTimes: [1, 2, 3, 4])
  // completed Times will be in milliseconds

  // set the date from the TaskList component
  // this date is the creation date (in utc) of the tasks that are loaded in TaskList component 
  const [date, setDate] = React.useState(null);

  // convert the utc date string in date state to local date object
  const localDate = new Date(date);

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
      <UserIntro />
      <TaskList setDate={setDate} />
      <TimeChart />
    </div>
  )
};

export default UserStatus;
