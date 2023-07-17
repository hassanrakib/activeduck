import React from "react";
import TimeChart from "../../Shared/TimeChart/TimeChart";
import TaskList from "../TaskList/TaskList";
import UserIntro from "../UserIntro/UserIntro";
import styles from "./UserStatus.module.css";
import {
  format,
  isSameYear,
  parseISO,
  startOfDay,
  endOfDay,
  endOfToday,
  subDays,
} from "date-fns";
import { socket } from "../../../socket";
const UserStatus = () => {
  // set the lastTaskDate from the TaskList component
  // this state contains an object whose taskDate property is the creation date (in utc)
  // of the last task from tasks that are loaded in TaskList component

  // also, it has activeTaskId property that holds the current active task's id
  // we will use it to spin the sand glass icon in the UserIntro component
  const [lastTaskDate, setLastTaskDate] = React.useState(null);

  // totalCompletedTimes is going to be an array of total completed times of a date range
  // total completed times will be in milliseconds (ex: [{_id: '2023-07-12', completedTime: 0}...])
  // _id holds the local date
  const [totalCompletedTimes, setTotalCompletedTimes] = React.useState([]);

  // get an array of totalCompletedTimes for a date range
  React.useEffect(() => {
    if (lastTaskDate) {
      // lastTaskDate.taskDate is the utc date in string
      // it was defined as a utc date object when the last task was created
      // if lastTaskDate.taskDate is undefined, use the today's last utc date
      // (lastTaskDate.taskDate will be undefined when no tasks is recieved from the be for today)
      // endDateString will be used to collect all the tasks upto this date
      const endDateString = lastTaskDate.taskDate
        ? endOfDay(parseISO(lastTaskDate.taskDate)).toISOString()
        : endOfToday().toISOString();

      // convert the utc date string in endDateString to local date object
      const localEndDate = parseISO(endDateString);

      // the number of days completed times we want
      const numberOfDaysCompletedTimes = 7;

      // subtract the number of days from localDate
      const dateAfterSubtraction = subDays(
        localEndDate,
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
  }, [lastTaskDate]);

  // convert the taskDate utc date string in lastTaskDate state to local date object
  // first time lastTaskDate state will be null also lastTaskDate.taskDate can be undefined
  // if no tasks found for the date
  // in these cases use current date
  const localDate = lastTaskDate?.taskDate
    ? parseISO(lastTaskDate.taskDate)
    : new Date();

  // format the localDate object to date string like "10 Jul 2023"
  // but if the localDate contains the year that is the current year then the year is not shown
  const formattedLocalDateString = format(
    localDate,
    `d MMM ${isSameYear(localDate, new Date()) ? "" : "yyy"}`
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
        isAnyTaskActive={!!lastTaskDate?.activeTaskId}
      />
      <TaskList setLastTaskDate={setLastTaskDate} />
      <TimeChart />
    </div>
  );
};

export default UserStatus;
