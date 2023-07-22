import React from "react";
import { socket } from "../socket";
import { endOfDay, isSameDay, startOfDay, startOfToday, subDays } from "date-fns";

const useTasksOfDays = (startDate) => {

    // get the endDate based on the startDate
    const endDate = endOfDay(startDate);

    // tasksOfDays will hold an array of objects where every object will look like {day: {startDate: localDate, endDate: localDate}, tasks: []}
    const [tasksOfDays, setTasksOfDays] = React.useState([]);
    // if loading new tasks of a date, it is true otherwise false
    const [loading, setLoading] = React.useState(false);
    // if error happens when trying to load tasks of a date
    const [error, setError] = React.useState(false);
    // current activeTaskId
    const [activeTaskId, setActiveTaskId] = React.useState("");


    // totalCompletedTimes is going to be an array of total completed times of a date range
    // total completed times will be in milliseconds (ex: [{_id: '2023-07-12', completedTime: 0}...])
    // _id holds the local date
    async function readTotalCompletedTimes(startDate, endDate, { tasks }) {
        // get an array of totalCompletedTimes for a date range
        // if there are tasks or it is today
        // then set totalCompletedTimes
        if (tasks.length || isSameDay(startDate, startOfToday())) {
            // endDateString will be used to collect all the tasks upto this date
            const endDateString = endDate.toISOString();

            // the number of days completed times we want
            const numberOfDaysCompletedTimes = 7;

            // subtract the number of days from localDate
            const dateAfterSubtraction = subDays(
                endDate,
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

                    // return totalCompletedTimes array
                    return { totalCompletedTimes: result[0].allDatesCompletedTimes }
                }
            );
        } else {
            return { totalCompletedTimes: [] };
        }
    }

    // load tasks by date
    React.useEffect(() => {

        function readTasksOfADay(startDate, endDate) {
            // emit "tasks:read" event to get the tasks of a date
            // startDate & endDate is the two dates of the same day to define start & end of the day
            // convert the startDate and endDate to utc date string
            socket.emit(
                "tasks:read",
                startDate.toISOString(),
                endDate.toISOString(),
                //   callback sent to recieve the tasks of a day
                (tasksOfADay) => {

                    // now read total completed times
                    readTotalCompletedTimes(startDate, endDate, tasksOfADay)
                        .then(totalCompletedTimes => {
                            //   set the tasks of a day to tasksOfDays state
                            setTasksOfDays((prevTasksOfDays) => [
                                // keep the previous tasksOfDays
                                ...prevTasksOfDays,
                                // add new tasksOfADay
                                {
                                    day: { startDate, endDate },
                                    ...tasksOfADay,
                                    ...totalCompletedTimes
                                },
                            ]);
                        })
                        .then(() => {
                            setLoading(false);
                        })
                });
        }

        // clear if there is any previous error
        setError(false);
        // as we are going to load tasks
        setLoading(true);

        // if socket got disconnected while a task was active, we stored endTime in localStorage
        // now, before reading tasks register endTime to workedTimeSpan object of that task
        if (localStorage.endTime) {
            const endTime = JSON.parse(localStorage.endTime);
            socket.emit(
                "workedTimeSpan:end",
                endTime._id,
                endTime.workedTimeSpanId,
                endTime.endTime,
                // send indexInTasksOfDays undefined
                undefined,
                (response) => {
                    console.log(response);
                    // if successful in saving the endTime
                    // "tasks:change" event is emitted from BE, that is listened by the TaskList component
                    // then the TaskList component emits "tasks:read" event to listen "tasks:read" event emitted by BE
                    // then by listening "tasks:read", TaskList component sets tasks state
                    // so re-render happens to this task as well
                    // and we clear activeTaskId to empty string in this process

                    // clear the local storage after saving endTime
                    localStorage.removeItem("endTime");

                    // then start reading tasks
                    readTasksOfADay(startDate, endDate);
                }
            );
        } else {
            readTasksOfADay(startDate, endDate);
        }
    }, [startDate, endDate]);

    // when there is any change of task
    React.useEffect(() => {
        // "tasks:change" event listener recieves the active task id
        // that we sent to BE during "workedTimeSpan:start" event in the Task component
        // this listener emits the "tasks:read" event and send the activeTaskId
        function onTasksChangeEvent(indexInTasksOfDays, activeTaskId) {
            const changedTasksOfADay = tasksOfDays[indexInTasksOfDays];
            const { day, day: { startDate, endDate } } = changedTasksOfADay;
            socket.emit("tasks:read", startDate.toISOString(), endDate.toISOString(), (tasksOfADay) => {
                readTotalCompletedTimes(startDate, endDate, tasksOfADay)
                    .then((totalCompletedTimes) => {
                        // create a shallow copy of tasksOfDays
                        const updatedTasksOfDays = [...tasksOfDays];
                        updatedTasksOfDays[indexInTasksOfDays] = { day, ...tasksOfADay, ...totalCompletedTimes };

                        // set activeTaskId state
                        setActiveTaskId(activeTaskId);

                        // set the tasksOfDays state
                        setTasksOfDays(updatedTasksOfDays);
                    })
            });
        }

        // listen to "tasks:change" event
        socket.on("tasks:change", onTasksChangeEvent);

        // cleanup
        return () => {
            socket.off("tasks:change", onTasksChangeEvent);
        }
    }, [tasksOfDays]);



    return { loading, error, tasksOfDays, activeTaskId };
};

export default useTasksOfDays;
