import { differenceInMilliseconds } from "date-fns";
import React from "react";
import { socket } from "../socket";

const withTaskProgressCalculation = (WrappedComponent) => {
  return function ContainerComponent(props) {
    // destructure
    const { isTaskActive, workedTimeSpans, levels } = props;

    // state that holds total completed time when the task is active
    const [completedTimeInMilliseconds, setCompletedTimeInMilliseconds] =
      React.useState(0);

    // initial completed time in milliseconds is stored in a ref object's current property
    // before the task becomes active
    // we storing it in a ref, so that it's not lost between renders
    // as we will use the same initial time everytime to add it to the time difference
    // of the last workedTimeSpan object's startTime and endTime, when the task becomes active
    // and storing it in ref will also prevent one re-render
    // that would happen if we would set it to a state after calculating
    const completedTimeBeforeTaskActiveRef = React.useRef(0);

    // know which is the current level of a task
    const [currentLevel, setCurrentLevel] = React.useState("Level - 1");

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

    //*** if the task not active ***//

    // calculate the completed time in milliseconds from workedTimeSpans array
    // we have to store it in the completedTimeInMilliseconds state
    // so that when the task becomes active, we can add last workedTimeSpan's startTime
    // and endTime difference to this state

    // lastWorkedTimeSpan.endTime can be undefined
    // if undefined then that means the task is active
    // so, when the task is not active or endTime property not undefined then we calculate
    // the completed time in milliseconds
    if (!isTaskActive) {
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

    //*** if task active ***//

    React.useEffect(() => {
      // register the listener of the "workedTimeSpan:continue" event
      function onWorkedTimeSpanContinue(endTime) {
        // calculate the last workedTimeSpan object's time difference between startTime and endTime
        // though endTime is not yet added to the object as it is in progress
        // we get the endTime by listening to the "workedTimeSpan:continue" event
        const timeDifference = getTimeDifferenceInMilliseconds(
          workedTimeSpans[workedTimeSpans.length - 1].startTime,
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
      }

      // when the task is not active
      if (!isTaskActive) {
        return () => {
          // cleanup the listener
          socket.off("workedTimeSpan:continue", onWorkedTimeSpanContinue);

          // clear the timer
          clearInterval(interval);
        };
      }

      // cleanup before unmounts
      return () => {
        // cleanup the listener
        socket.off("workedTimeSpan:continue", onWorkedTimeSpanContinue);

        // clear the timer
        clearInterval(interval);
      };
    }, [isTaskActive, workedTimeSpans]);

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

    // return the wrapped component with necessary props that has been calculated here
    return (
      <WrappedComponent
        completedTimeInMilliseconds={
          // if the task is active, then send completedTimeInMilliseconds state
          // that is calculated after the task becomes active
          // if the task is not active, send initial completed time from ref.current
          isTaskActive
            ? completedTimeInMilliseconds
            : completedTimeBeforeTaskActiveRef.current
        }
        currentLevel={currentLevel}
        {...props}
      />
    );
  };
};

export default withTaskProgressCalculation;
