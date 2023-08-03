import { isSameDay, startOfToday } from "date-fns";
import React from "react";
import Loader from "../../Shared/Loader/Loader";
import UserStatus from "../UserStatus/UserStatus";
import useTasksOfDays from "../../../hooks/useTasksOfDays";
import { socket } from "../../../socket";

const UserStatusList = () => {
  // observer.current holds an intersection observer
  const observer = React.useRef(null);

  // dates that have tasks created by the user
  // we will use every date from here to set startDate state
  const [dates, setDates] = React.useState([]);

  // index of the date in dates
  // we increase it in lastUserStatusRef callback function
  // after we use an index
  const indexInDatesRef = React.useRef(0);

  // startDate by default set to the today's start date
  // so that we get the first UserStatus component for the date
  // startDate is updated in lastUserStatusRef callback function
  // it defines for which date we will load the tasks
  // startDate is sent to the useTasksOfDays hook to set tasksOfDays state
  const [startDate, setStartDate] = React.useState(startOfToday());

  // get tasks of different dates
  const { loading, error, tasksOfDays, activeTaskId } =
    useTasksOfDays(startDate);

  // get the dates that have tasks created by the user
  // we will use every date from here to get the tasks for them and total completed times array
  React.useEffect(() => {
    // get the user's time zone to send it to the backend
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    socket.emit("existingDates:read", timeZone, (existingDates) => {
      // get the local date strings of the tasks that user created
      // if no task created by an user existingDates will be an empty array
      // so, localDatesOfTasks will be undefined
      const localDatesOfTasks = existingDates[0]?.localDates;

      // if localDatesOfTasks is not undefined
      if (localDatesOfTasks) {
        // get the first local date of tasks
        // this can be today's date as we get localDatesOfTasks in descending order
        const firstLocalDateOfTasks = new Date(localDatesOfTasks[0]);

        // check if user has today's date in localDatesOfTasks
        if (isSameDay(startOfToday(), firstLocalDateOfTasks)) {
          // remove today's date, because we have it by default set to the startDate
          // so today's date is already sent to the useTasksOfDays hook
          const updatedLocalDatesOfTasks = [...localDatesOfTasks];
          updatedLocalDatesOfTasks.shift();

          // set the updatedLocalDatesOfTasks to the dates state
          setDates(updatedLocalDatesOfTasks);
        } else {
          // if today's date is not in localDatesOfTasks
          // set whatever we have in localDatesOfTasks
          setDates(localDatesOfTasks);
        }
      }
    });
  }, []);

  // send this function to the ref prop of the last <UserStatus /> component
  // to get the node of the last <UserStatus />
  // this node will be monitored by the intersection observer
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
        // and date in dates state is not undefined
        // it will be undefined if dates are not recieved yet from the backend
        // or, we have completed iteration on dates array so indexInDatesRef.current
        // has gone up 1 above the last index
        // then we allow to set startDate by subtracting one more day
        if (entries[0].isIntersecting && dates[indexInDatesRef.current]) {
          // set startDate state by taking the date string from the dates state
          // covert date string to date object
          setStartDate(new Date(dates[indexInDatesRef.current]));

          // after using index to get the date from dates and setting it to the startDate
          // increase indexInDates by 1
          indexInDatesRef.current += 1;
        }
      });

      // let intersection observer that is stored in observer.current to monitore the last <UserStatus />
      if (node) observer.current.observe(node);
    },
    [loading, dates]
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
                // send the index of the of the UserStatus in tasksOfDays state
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
            // send the index of the of the UserStatus in tasksOfDays state
            indexInTasksOfDays={index}
            tasksOfADay={tasksOfADay}
            activeTaskId={activeTaskId}
          />
        );
      })}
      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "20px 0 10px",
          }}
        >
          <Loader />
        </div>
      )}
    </div>
  );
};

export default UserStatusList;
