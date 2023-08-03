import TimeChart from "../../Shared/TimeChart/TimeChart";
import TaskList from "../TaskList/TaskList";
import UserIntro from "../UserIntro/UserIntro";
import styles from "./UserStatus.module.css";
import { format, isSameYear } from "date-fns";

const UserStatus = ({ tasksOfADay, indexInTasksOfDays, activeTaskId }) => {
  const { day, tasks, totalCompletedTimes } = tasksOfADay;

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
        tasks={tasks}
        activeTaskId={activeTaskId}
      />
      <TaskList
        tasks={tasks}
        indexInTasksOfDays={indexInTasksOfDays}
        activeTaskId={activeTaskId}
      />
      <TimeChart totalCompletedTimes={totalCompletedTimes} />
    </div>
  );
};

export default UserStatus;
