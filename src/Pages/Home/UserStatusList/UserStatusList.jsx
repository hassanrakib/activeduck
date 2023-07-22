import { isAfter, parseISO, startOfToday, subDays } from "date-fns";
import React from "react";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../Shared/Loader/Loader";
import UserStatus from "../UserStatus/UserStatus";
import useTasksOfDays from "../../../hooks/useTasksOfDays";

const UserStatusList = () => {
  // get the user from the AuthContext
  const { user } = useAuth();

  // this is the date in utc string that says when the user was created
  // so, we can use it to check that the startDate variable is after the user created his account
  // if startDate before this date, we will not allow to set startDate state by subtracting one more day
  //   convert to local date
  const userCreatedAt = parseISO(user.createdAt);

  // observer.current holds an intersection observer
  const observer = React.useRef(null);

  // startDate by default set to the user's local start date of today
  // it defines for which date we will load the tasks
  const [startDate, setStartDate] = React.useState(startOfToday());

  //   get tasks of different dates
  const { loading, error, tasksOfDays, activeTaskId } =
    useTasksOfDays(startDate);

  // send this function to the ref prop of the last <UserStatus /> component
  //   to get the node of the last <UserStatus />
  //   this node will be monitored by the intersection observer
  // to get to know when this node is visible on the viewport,
  const lastUserStatusRef = React.useCallback(
    (node) => {
      // if tasks of a date is loading, then don't go further
      if (loading) return;

      // if not loading & observer.current holds an intersection observer,
      // (after first time loading tasks, observer.current will not hold any intersection observer)
      // remove the existing intersection observer
      if (observer.current) observer.current.disconnect();

      // add new intersection observer to the observer.current
      // entries is an array of nodes that IntersectionObserver constructor recieves
      observer.current = new IntersectionObserver((entries) => {
        // if the node is visible on the viewport
        // and startDate is after user created his account
        // then we allow to set startDate by subtracting one more day
        if (entries[0].isIntersecting && isAfter(startDate, userCreatedAt)) {
          // set startDate by subtracting one day from the prev startDate
          setStartDate((prevStartDate) => subDays(prevStartDate, 1));
        }
      });

      // let intersection observer that is stored in observer.current to monitore the last <UserStatus />
      if (node) observer.current.observe(node);
    },
    [loading, startDate, userCreatedAt]
  );

  return (
    <div>
      {tasksOfDays.map((tasksOfADay, index) => {
        // if it is the last <UserStatus />
        if (tasksOfDays.length === index + 1) {
          return (
            <div
              key={index}
              // add the ref prop
              ref={lastUserStatusRef}
            >
              <UserStatus
                indexInTasksOfDays={index}
                tasksOfADay={tasksOfADay}
                activeTaskId={activeTaskId}
              />
            </div>
          );
        }
        return (
          <UserStatus
            key={index}
            indexInTasksOfDays={index}
            tasksOfADay={tasksOfADay}
            activeTaskId={activeTaskId}
          />
        );
      })}
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default UserStatusList;
