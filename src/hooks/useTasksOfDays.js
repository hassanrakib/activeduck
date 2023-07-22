import React from "react";
import { socket } from "../socket";
import { endOfDay } from "date-fns";

const useTasksOfDays = (startDate) => {

    // tasksOfDays will hold an array of objects where every object will look like {day: {startDate: localDate, endDate: localDate}, tasks: []}
    const [tasksOfDays, setTasksOfDays] = React.useState([]);
    // if loading new tasks of a date, it is true otherwise false
    const [loading, setLoading] = React.useState(false);
    // if error happens when trying to load tasks of a date
    const [error, setError] = React.useState(false);

    // load tasks by date
    React.useEffect(() => {
        // clear if there is any previous error
        setError(false);
        // as we are going to load tasks
        setLoading(true);

        // get the endDate based on the startDate
        const endDate = endOfDay(startDate);

        // if socket got disconnected while a task was active, we stored endTime in localStorage
        // now, before reading tasks register endTime to workedTimeSpan object of that task
        if (localStorage.endTime) {
            const endTime = JSON.parse(localStorage.endTime);
            socket.emit(
                "workedTimeSpan:end",
                endTime._id,
                endTime.workedTimeSpanId,
                endTime.endTime,
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
                }
            );
        } else {
            // emit "tasks:read" event to get the tasks of a date
            // startDate & endDate is the two dates of the same day to define start & end of the day
            // convert the startDate and endDate to utc date string
            socket.emit(
                "tasks:read",
                startDate.toISOString(),
                endDate.toISOString(),
                //   callback sent to recieve the tasks of a day
                (tasksOfADay) => {

                    //   set the tasks of a day to tasksOfDays state
                    setTasksOfDays((prevTasksOfDays) => [
                        // keep the previous tasksOfDays
                        ...prevTasksOfDays,
                        // add new tasksOfADay
                        { day: { startDate, endDate }, ...tasksOfADay },
                    ]);

                    // as tasks of a date loaded
                    setLoading(false);
                });
        }
    }, [startDate]);

    // when there is any change of task
    React.useEffect(() => {
        // "tasks:change" event listener recieves the active task id
        // that we sent to BE during "workedTimeSpan:start" event in the Task component
        // this listener emits the "tasks:read" event and send the activeTaskId
        function onTasksChangeEvent(indexInTasksOfDays, activeTaskId) {
            const changedTasksOfADay = tasksOfDays[indexInTasksOfDays];
            const { day, day: { startDate, endDate } } = changedTasksOfADay;
            socket.emit("tasks:read", startDate.toISOString(), endDate.toISOString(), (tasksOfADay) => {
                // create a shallow copy of tasksOfDays
                const updatedTasksOfDays = [...tasksOfDays];
                updatedTasksOfDays[indexInTasksOfDays] = { day, ...tasksOfADay };

                // set the tasksOfDays state
                setTasksOfDays(updatedTasksOfDays);
            });
        }

        // listen to "tasks:change" event
        socket.on("tasks:change", onTasksChangeEvent);

        // cleanup
        return () => {
            socket.off("tasks:change", onTasksChangeEvent);
        }
    }, [tasksOfDays]);



    return { loading, error, tasksOfDays };
};

export default useTasksOfDays;
