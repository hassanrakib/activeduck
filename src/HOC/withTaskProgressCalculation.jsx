import { differenceInMilliseconds } from "date-fns";
import React from "react";
import { socket } from "../socket";

const withTaskProgressCalculation = (WrappedComponent) => {
  return function ContainerComponent (props) {
    // destructure
    const { isTaskActive, workedTimeSpans, levels } = props;

    // state that holds total completed time of a task
    const [completedTimeInMilliseconds, setCompletedTimeInMilliseconds] =
      React.useState(0);

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
    // we have to store it in completedTimeInMillisecondsRef.current
    // so that it is not lost between renders
    // also, i don't want the change of completed time to cause re-renders

    // lastWorkedTimeSpan.endTime can be undefined
    // if undefined then that means the task is active
    // so, when the task is not active or endTime property not undefined then we calculate
    // the completed time in milliseconds
    React.useEffect(() => {
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

      //   set the completedTimeInMilliseconds state
      setCompletedTimeInMilliseconds(completedTimeBeforeTaskActive);
    }}, [isTaskActive, workedTimeSpans]);

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

        // update the completedTimeInMilliseconds state
        setCompletedTimeInMilliseconds((prevCompletedTime) => prevCompletedTime + timeDifference);
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

    // return the wrapped component with necessary props that has been calculated here
    return <WrappedComponent completedTimeInMilliseconds={completedTimeInMilliseconds} {...props} />
  };
};

export default withTaskProgressCalculation;
