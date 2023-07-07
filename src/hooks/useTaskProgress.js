import { differenceInMilliseconds } from "date-fns";
import React from "react";
import { socket } from "../socket";

const useTaskProgress = (_id, activeTaskId, workedTimeSpans, levels) => {

  //  if the current activeTaskId equals to this task's _id, that means the task is active
  const isTaskActive = _id === activeTaskId;

  // get the last workedTimeSpan object
  // when the task becomes active, the last workedTimeSpan in workedTimeSpans array of the task
  // is the active workedTimeSpan that has startTime property but no endTime property
  const lastWorkedTimeSpan = workedTimeSpans[workedTimeSpans.length - 1];

  // when the task is active, "workedTimeSpan:continue" event listener
  // recieves the endTime and updates the ref.current
  const activeTaskEndTimeRef = React.useRef();

  // state that holds total completed time when the task is active
  const [completedTimeInMilliseconds, setCompletedTimeInMilliseconds] =
    React.useState(0);

  // initial completed time in milliseconds is stored in a ref object's current property
  // before the task becomes active
  // we are storing it in a ref, so that it's not lost between renders
  // as we will use the same initial time everytime to add it to the time difference
  // of the last workedTimeSpan object's startTime and endTime, when the task becomes active
  // and storing it in ref will also prevent one re-render
  // that would happen if we would set it to a state after calculating
  const completedTimeBeforeTaskActiveRef = React.useRef(0);

  // know which is the current level of a task
  const [currentLevel, setCurrentLevel] = React.useState("Level - 1");

  // know when the user got disconnected and use this to do some styling of progress & play pause icon
  const [isDisconnected, setIsDisconnected] = React.useState(false);


  // delete the last object from workedTimeSpans array
  function deleteLastWorkedTimeSpan(_id, workedTimeSpanId) {
    // note that workedTimeSpanId is being wrapped in an array
    socket.emit("workedTimeSpan:delete", _id, [workedTimeSpanId]);
  }

  // get time difference in milliseconds between two date objects
  const getTimeDifferenceInMilliseconds = (
    startTimeInString,
    endTimeInString
  ) => {
    // converts utc date strings to the date objects
    const startTime = new Date(startTimeInString);
    const endTime = new Date(endTimeInString);

    // get the time difference between startTime and endTime in milliseconds
    return differenceInMilliseconds(endTime, startTime);
  };

  // set the completedTimeBeforeTaskActiveRef.current
  function setCompletedTimeBeforeTaskActiveRef() {
    // calculate the completed time in milliseconds from workedTimeSpans array
    const completedTimeBeforeTaskActive = workedTimeSpans.reduce(
      (completedTime, timeSpan) => {
        // get the time difference between startTime and endTime in milliseconds
        // for every timeSpan we are getting time difference and adding it to the completedTime
        // finally we get one returned value by the reduce method
        const timeDifference = getTimeDifferenceInMilliseconds(
          timeSpan.startTime,
          timeSpan.endTime
        );

        // add timeDifference to completedTime
        // initial completedTime is 0
        return completedTime + timeDifference;
      },
      0
    );

    // store the initial time before the task is active
    completedTimeBeforeTaskActiveRef.current = completedTimeBeforeTaskActive;
  }

  //*** if the task not active ***//

  // if the task is not active and it has lastWorkedTimeSpan object in workedTimeSpans array
  // ensures that at least one element exists in the array
  if (!isTaskActive && lastWorkedTimeSpan) {
    // before calculating and setting completedTimeBeforeTaskActiveRef.current
    // workedTimeSpans last element may not have its endTime property
    // because user may delete endTime from localStorage that was saved when user got
    // disconnected while doing a task, so we haven't been able to register endTime and
    // and set tasks in TaskList component
    // instead we set tasks only, skipping the registering endTime part in the TaskList

    // if the task is not active, lastWorkedTimeSpan.endTime should exist
    // even then, if lastWorkedTimeSpan.endTime doesn't exist
    // we will delete that lastWorkedTimeSpan object from workedTimeSpans array
    if (!lastWorkedTimeSpan.endTime) {
      // delete the lastWorkedTimeSpan
      deleteLastWorkedTimeSpan(_id, lastWorkedTimeSpan._id);
    } else {
      // calculate the completed time in milliseconds from workedTimeSpans array
      // we have to store it in the completedTimeBeforeTaskActiveRef.current
      // so that when the task becomes active, we can add last workedTimeSpan's startTime
      // and endTime difference to this
      setCompletedTimeBeforeTaskActiveRef();
    }
  }

  //*** if task active ***//

  React.useEffect(() => {
    // register the listener of the "workedTimeSpan:continue" event
    function onWorkedTimeSpanContinue(endTime) {
      // update the activeTaskEndTimeRef.current, so that when the socket gets disconnected
      // we can store the endTime in localStorage to update endTime of the task after socket
      // again reconnects
      activeTaskEndTimeRef.current = endTime;

      // calculate the last workedTimeSpan object's time difference between startTime and endTime
      // though endTime is not yet added to the object as it is in progress
      // we get the endTime by listening to the "workedTimeSpan:continue" event
      const timeDifference = getTimeDifferenceInMilliseconds(
        lastWorkedTimeSpan.startTime,
        endTime
      );

      // update the completedTimeInMilliseconds state by adding everytime the timeDifference
      // to the same initial completedTimeBeforeTaskActiveRef.current
      setCompletedTimeInMilliseconds(
        completedTimeBeforeTaskActiveRef.current + timeDifference
      );
    }

    let interval;
    // if the task is active
    if (isTaskActive) {
      interval = setInterval(() => {
        // ping the server every one second
        // so that, server sends back the end time
        socket.emit("workedTimeSpan:continue");
      }, 1000);

      // "workedTimeSpan:continue" for getting end time
      socket.on("workedTimeSpan:continue", onWorkedTimeSpanContinue);

      // when socket gets disconnected
      socket.on("disconnect", (err) => {
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
          endTime
        ) => {
          socket
            .timeout(2000)
            .emit(
              event,
              activeTaskId,
              workedTimeSpanId,
              endTime,
              (err, response) => {
                // if err happens in saving endTime, try again
                if (err) {
                  registerUnfinishedEndtime(
                    event,
                    activeTaskId,
                    workedTimeSpanId,
                    endTime
                  );
                } else {
                  console.log(response);
                  // if connection reestablishes, set isDisconnected to false
                  setIsDisconnected(false);

                  // if successful in saving the endTime
                  // "tasks:change" event is emitted from BE, that is listened by the TaskList component
                  // then the TaskList component emits "tasks:read" event to listen "tasks:read" event emitted by BE
                  // then by listening "tasks:read", TaskList component sets tasks state
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
          activeTaskEndTimeRef.current
        );
      });
    }

    // when the task is not active
    if (!isTaskActive) {
      return () => {
        // cleanup the listener
        socket.off("workedTimeSpan:continue", onWorkedTimeSpanContinue);
        socket.off("disconnect");

        // clear the timer
        clearInterval(interval);
      };
    }

    // cleanup before unmounts
    return () => {
      // cleanup the listener
      socket.off("workedTimeSpan:continue", onWorkedTimeSpanContinue);
      socket.off("disconnect");

      // clear the timer
      clearInterval(interval);
    };
  }, [isTaskActive, workedTimeSpans, activeTaskId, lastWorkedTimeSpan]);

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
    // if the task is active, completedTime = completedTimeInMilliseconds
    if (isTaskActive) {
      setCurrentLevelFn(completedTimeInMilliseconds);

      // if the task is not active completedTime = completedTimeBeforeTaskActiveRef.current
    } else {
      setCurrentLevelFn(completedTimeBeforeTaskActiveRef.current);
    }
  }, [
    isTaskActive,
    completedTimeBeforeTaskActiveRef,
    completedTimeInMilliseconds,
    levels,
  ]);

  // return necessary properties that have been calculated here
  return {
    completedTimeInMilliseconds:
      // if the task is active, then send completedTimeInMilliseconds state
      // that is calculated after the task becomes active
      // if the task is not active, send initial completed time from ref.current
      isTaskActive
        ? completedTimeInMilliseconds
        : completedTimeBeforeTaskActiveRef.current,
    isDisconnected,
    currentLevel,
    isTaskActive,
  }
};

export default useTaskProgress;
