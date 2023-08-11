import React from "react";
import { socket } from "../socket";
import getTimeDifferenceInMilliseconds from "../lib/getTimeDifferenceInMilliseconds";

// indexInTasksOfDays is the index of the object in the tasksOfDays state
// for more understanding see the onTasksChange event listener function (that uses indexInTasksOfDays) in useTasksOfDays hook
const useTaskProgress = (_id, activeTaskId, indexInTasksOfDays, workedTimeSpans, levels) => {

  //  if the current activeTaskId equals to this task's _id, that means the task is active
  const isTaskActive = _id === activeTaskId;

  // get the last workedTimeSpan object
  // when the task becomes active, the last workedTimeSpan in workedTimeSpans array of the task
  // is the active workedTimeSpan that has startTime property but no endTime property
  const lastWorkedTimeSpan = workedTimeSpans[workedTimeSpans.length - 1];

  // when the task is active, "workedTimeSpan:continue" event listener
  // recieves the endTime and updates the ref.current
  const activeTaskEndTimeRef = React.useRef();

  // know which is the current level of a task
  const [currentLevel, setCurrentLevel] = React.useState("Level - 1");

  // know when the user got disconnected and use this to do some styling of progress & play pause icon
  const [isDisconnected, setIsDisconnected] = React.useState(false);

  // calculate initial completed time of a task
  // when the task becomes active:
  // we will use the same initial time everytime to add it to the time difference
  // of the last workedTimeSpan object's startTime and endTime and set completedTimeInMs state
  const initialCompletedTimeInMs = React.useMemo(() => {
    console.log('calculating initial completed time');
    // calculate the completed time in milliseconds from workedTimeSpans array
    return workedTimeSpans.reduce(
      (completedTime, timeSpan) => {
        // get the time difference between startTime and endTime in milliseconds
        // for every timeSpan we are getting time difference and adding it to the completedTime
        // finally we get one returned value by the reduce method
        const timeDifference = getTimeDifferenceInMilliseconds(
          timeSpan.startTime,
          // if the task is active at the time of rendering the Task component
          // (a socket of a user may have a task active and then another socket of the same user 
          // may join the room and get activeTaskId, so at the time of rendering the task it is active)
          // timeSpan.endTime will be undefined, so instead use timeSpan.startTime which will result
          // timeDifference to be 0 millisecond
          timeSpan.endTime || timeSpan.startTime
        );

        // add timeDifference to completedTime
        return completedTime + timeDifference;
      },
      // initial completedTime is 0
      0
    );
  }, [workedTimeSpans]);

  // state that holds total completed time of the task
  // it is initialized to the computed initialCompletedTimeInMs
  const [completedTimeInMs, setCompletedTimeInMs] =
    React.useState(initialCompletedTimeInMs);

  //*** if the task not active ***//

  React.useEffect(() => {
    // if the task is not active and it has lastWorkedTimeSpan object in workedTimeSpans array
    // (lastWorkedTimeSpan ensures that at least one element exists in the array)
    // but no endTime property in lastWorkedTimeSpan
    if (!isTaskActive && lastWorkedTimeSpan && !lastWorkedTimeSpan.endTime) {
      // workedTimeSpans last element may not have its endTime property
      // because user may delete endTime from localStorage that was saved when user got
      // disconnected while doing a task, so we haven't been able to register endTime and
      // and start reading tasks in useTasksOfDays hook
      // instead we start reading tasks skipping the registering endTime part

      // if the task is not active, lastWorkedTimeSpan.endTime should exist
      // even then, if lastWorkedTimeSpan.endTime doesn't exist
      // we will delete that lastWorkedTimeSpan object from workedTimeSpans array

      // note that workedTimeSpanId is being wrapped in an array
      socket.emit("workedTimeSpan:delete", _id, [lastWorkedTimeSpan._id], indexInTasksOfDays);
    }
  }, [_id, indexInTasksOfDays, isTaskActive, lastWorkedTimeSpan]);

  //*** if task active ***//

  React.useEffect(() => {
    // register the listener of the "workedTimeSpan:continue" event
    function onWorkedTimeSpanContinue(startTime, endTime) {
      // update the activeTaskEndTimeRef.current, so that when the socket gets disconnected
      // we can store the endTime in localStorage to update endTime of the task after socket
      // again reconnects
      activeTaskEndTimeRef.current = endTime;

      // calculate the last workedTimeSpan object's time difference between startTime and endTime
      // though endTime is not yet added to the object as it is in progress
      // we get the endTime by listening to the "workedTimeSpan:continue" event
      const timeDifference = getTimeDifferenceInMilliseconds(
        startTime,
        endTime
      );

      // update the completedTimeInMs state by adding everytime the timeDifference
      // to the same initial completed time
      setCompletedTimeInMs(
        initialCompletedTimeInMs + timeDifference
      );
    }

    // disconnect event listener
    function onDisconnect(err) {
      // clear the listener that gets endTime from BE
      socket.off("workedTimeSpan:continue", onWorkedTimeSpanContinue);

      console.log(err);
      // if client can't communicate with the server we get err
      // save the endTime of the active task to localStorage
      // that we updated to activeTaskEndTimeRef.current
      // when the socket had connection to the server and we listened to "workedTimeSpan:continue"

      // saving to localStorage is important becuase the user may leave the application
      // while he/she was disconnected
      localStorage.setItem(
        "endTime",
        JSON.stringify({
          _id: activeTaskId,
          endTime: activeTaskEndTimeRef.current,
          // saving the _id of the lastWorkedTimeSpan, because it is the active workedTimeSpan
          workedTimeSpanId: lastWorkedTimeSpan._id,
        })
      );

      // set isDisconnected to true so that Progress & PlayPauseIcon component can use it
      // for some kind of styling
      setIsDisconnected(true);

      // but if user doesn't leave the application we will continuously try to save the endTime
      const registerUnfinishedEndtime = (
        event,
        activeTaskId,
        workedTimeSpanId,
        endTime,
        wasDisconnected,
        indexInTasksOfDays,
      ) => {
        socket
          .timeout(2000)
          .emit(
            event,
            activeTaskId,
            workedTimeSpanId,
            endTime,
            wasDisconnected,
            indexInTasksOfDays,
            (err, response) => {
              // if err happens in saving endTime, try again
              if (err) {
                registerUnfinishedEndtime(
                  event,
                  activeTaskId,
                  workedTimeSpanId,
                  endTime,
                  wasDisconnected,
                  indexInTasksOfDays
                );
              } else {
                console.log(response);
                // if connection reestablishes, set isDisconnected to false
                setIsDisconnected(false);

                // if successful in saving the endTime
                // "tasks:change" event is emitted from BE, that is listened by the useTasksOfDays hook
                // then the useTasksOfDays hook emits "tasks:read" event to set updated tasksOfDays
                // so re-render happens to this task as well
                // and we clear activeTaskId to empty string in this process

                // clear the local storage after saving endTime
                localStorage.removeItem("endTime");
              }
            }
          );
      };
      registerUnfinishedEndtime(
        "workedTimeSpan:end",
        activeTaskId,
        lastWorkedTimeSpan._id,
        activeTaskEndTimeRef.current,
        true,
        indexInTasksOfDays,
      );
    }

    let interval;
    // if the task is active
    if (isTaskActive) {
      interval = setInterval(() => {
        // ping the server every one second and send the startTime of the last workedTimeSpan
        // so that, server sends back the startTime and endTime as well
        socket.emit("workedTimeSpan:continue", lastWorkedTimeSpan.startTime);
      }, 1000);

      // "workedTimeSpan:continue" for getting end time
      socket.on("workedTimeSpan:continue", onWorkedTimeSpanContinue);

      // when socket gets disconnected
      socket.on("disconnect", onDisconnect);
    }

    // when the task is not active
    if (!isTaskActive) {
      return () => {
        // cleanup the listener
        socket.off("workedTimeSpan:continue", onWorkedTimeSpanContinue);
        socket.off("disconnect", onDisconnect);

        // clear the timer
        clearInterval(interval);
      };
    }

    // cleanup before unmounts
    return () => {
      // cleanup the listeners
      socket.off("workedTimeSpan:continue", onWorkedTimeSpanContinue);
      socket.off("disconnect", onDisconnect);

      // clear the timer
      clearInterval(interval);
    };
  }, [activeTaskId, indexInTasksOfDays, initialCompletedTimeInMs, isTaskActive, lastWorkedTimeSpan]);

  // determine the current level
  React.useEffect(() => {
    const { level_1, level_2 } = levels;

    // it sets current level
    const setCurrentLevelFn = (completedTime) => {
      // first check completedTime is greater than level_2
      // if greater, then setCurrentLevel
      if (completedTime > level_2) {
        return setCurrentLevel("Level - 3");
      }
      // if completedTime not greater than level_2, it might become greater than level_1
      if (completedTime > level_1) {
        setCurrentLevel("Level - 2");
      }
    };
    // call the setCurrentLevelFn function
    setCurrentLevelFn(completedTimeInMs);
  }, [levels, completedTimeInMs]);

  // return necessary properties that have been calculated here
  return {
    completedTimeInMs,
    isDisconnected,
    currentLevel,
    isTaskActive,
  }
};

export default useTaskProgress;
