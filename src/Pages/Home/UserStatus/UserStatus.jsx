import React from "react";
import TimeChart from "../../Shared/TimeChart/TimeChart";
import TaskList from "../TaskList/TaskList";
import UserIntro from "../UserIntro/UserIntro";
import styles from "./UserStatus.module.css";
import {
  format,
  isSameYear,
  startOfDay,
  subDays,
  isSameDay,
  startOfToday,
} from "date-fns";
import { socket } from "../../../socket";
const UserStatus = ({ tasksOfADay, indexInTasksOfDays }) => {
  const { day, tasks} = tasksOfADay;

  // totalCompletedTimes is going to be an array of total completed times of a date range
  // total completed times will be in milliseconds (ex: [{_id: '2023-07-12', completedTime: 0}...])
  // _id holds the local date
  const [totalCompletedTimes, setTotalCompletedTimes] = React.useState([]);

  // get an array of totalCompletedTimes for a date range
  React.useEffect(() => {
    // if there are tasks or it is today
    // then set totalCompletedTimes
    if (tasks.length || isSameDay(day.startDate, startOfToday())) {
      // endDateString will be used to collect all the tasks upto this date
      const endDateString = day.endDate.toISOString();

      // the number of days completed times we want
      const numberOfDaysCompletedTimes = 7;

      // subtract the number of days from localDate
      const dateAfterSubtraction = subDays(
        day.endDate,
        // we have to subtract 1 day less than numberOfDaysCompletedTimes
        // because we want end date to be included, subtraction is done by keeping end date
        // such as if today is 16th July then subtracting 7 days will get us
        // 9th July, but we want it to be 10th July as 16th July is included
        // so, start date will be 10th July and end date will be 16th July
        // see "totalCompletedTimes:read" event in the be for more clearer idea
        numberOfDaysCompletedTimes - 1
      );

      // get start date of dateAfterSubtraction, then convert it to utc date
      const startDateString = startOfDay(dateAfterSubtraction).toISOString();

      // get the user's time zone to send it to the backend
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // sending startDateString, endDateString and timeZone
      // we will collect all the tasks between startDateString and endDateString to get
      // array of completedTimes for a number of days [{_id: '2023-07-12', completedTime: 0}...]
      // sending timeZone to convert utc date to local date and get it here in _id
      socket.emit(
        "totalCompletedTimes:read",
        startDateString,
        endDateString,
        numberOfDaysCompletedTimes,
        timeZone,
        (result) => {
          console.log(result[0].allDatesCompletedTimes);
          // set totalCompletedTimes state
          setTotalCompletedTimes(result[0].allDatesCompletedTimes);
        }
      );
    }
  }, [day, tasks.length]);

  // if no task for the date & the date is not today
  // then don't render, instead return null
  if (!tasks.length && !isSameDay(day.startDate, startOfToday())) {
    return null;
  }

  // format the day.startDate object to date string like "10 Jul 2023"
  // but if the day.startDate contains the year that is the current year then the year is not shown
  const formattedLocalDateString = format(
    day.startDate,
    `d MMM ${isSameYear(day.startDate, new Date()) ? "" : "yyy"}`
  );

  return (
    <div className={styles.userStatus}>
      {/* tasks creation date */}
      <div className={styles.date}>{formattedLocalDateString}</div>
      {/* user introduction with total worked time */}
      {/* totalCompletedTimes state holds an array of completedTimes objects of a date range */}
      {/* the last element is the end date's total worked time that we will show in the UserIntro */}
      <UserIntro
        totalCompletedTime={
          totalCompletedTimes[totalCompletedTimes.length - 1]?.completedTime
        }
        // isAnyTaskActive={!!lastTaskDate?.activeTaskId}
      />
      <TaskList tasksOfADay={tasksOfADay} indexInTasksOfDays={indexInTasksOfDays} />
      <TimeChart totalCompletedTimes={totalCompletedTimes} />
    </div>
  );
};

export default UserStatus;
