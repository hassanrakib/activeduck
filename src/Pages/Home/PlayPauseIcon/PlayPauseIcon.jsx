import { FiPlayCircle } from "react-icons/fi";
import { FiPauseCircle } from "react-icons/fi";
import { socket } from "../../../socket";
import styles from "./PlayPauseIcon.module.css";
import React from "react";

const PlayPauseIcon = ({
  task,
  activeTaskId,
  isTaskActive,
  completedTimeInMilliseconds,
  isDisconnected,
}) => {
  // destructure
  const { workedTimeSpans, _id, levels } = task;
  const { level_3 } = levels;

  // get the index of the workedTimeSpans array's last element
  const lastTimeSpanIndex = workedTimeSpans.length - 1;

  // a user can click more than one on the icon at a time
  // before getting response from the server
  // and making this task active by getting and using activeTaskId
  // whereis isTaskActive prevents making a task active if the task is already in active state
  // to stop emitting more than one "workedTimeSpan:start" event to server
  // before registering endTime by emitting "workedTimeSpan:end" event
  // we will use this state
  const [isTaskActiveLoading, setIsTaskActiveLoading] = React.useState(false);


  // if isTaskActiveLoading,
  // after making the task active we update isTaskActiveLoading state to false
  if (isTaskActiveLoading && isTaskActive) {
    setIsTaskActiveLoading(false);
  }

  // function that registers startTime and endTime property to a workedTimeSpan in workedTimeSpans array
  // used this function as onClick handler of the play pause icon container
  // and send task's _id and workedTimeSpans array's last element's index
  const addWorkedTimeSpan = (_id, lastTimeSpanIndex) => {
    // if the task is active
    // we need to set the endTime property to the last time span object in workedTimeSpans array
    if (isTaskActive) {
      // register the end time to a task's last workedTimeSpan obj in workedTimeSpans array
      return socket.emit(
        "workedTimeSpan:end",
        _id,
        lastTimeSpanIndex,
        // don't send endTime instead send undefined, because we manually stopping the task
        // so, it takes endTime from BE
        undefined,
        (response) => {
          console.log(response);
          // if successful in saving the endTime
          // "tasks:change" event is emitted from BE, that is listened by the TaskList component
          // then the TaskList component emits "tasks:read" event to listen "tasks:read" event emitted by BE
          // then by listening "tasks:read", TaskList component sets tasks state
          // so re-render happens to this task as well
          // and we clear activeTaskId to empty string in this process
        }
      );
    }

    // first check that any other task is active or not
    // if not active, activeTaskId is empty string
    // then check that completedTimeInMilliseconds is not greather than or equal to level_3
    // if not equal to level_3, that means the task will take more time to complete
    // so we can activate the task
    if (
      !activeTaskId &&
      !isTaskActiveLoading &&
      !(completedTimeInMilliseconds >= level_3)
    ) {
      // make isTaskActiveLoading state true
      setIsTaskActiveLoading(true);

      // push workedTimeSpan obj in workedTimeSpans array
      // with startTime property set to the current time
      // no endTime property

      // here we send _id to the "workedTimeSpan:start" listener in the backend
      // "workedTimeSpan:start" listener recieves and send _id as activeTaskId
      // with "tasks:change" event to the client side
      // "tasks:change" is listened in the TaskList component that finally does re-render of the
      // tasks and we get activeTaskId
      socket
        .timeout(5000)
        .emit("workedTimeSpan:start", _id, (err, response) => {
          if (err) {
            console.log(err);
            // as error happened so, set isTaskActiveLoading to false
            setIsTaskActiveLoading(false);
          } else {
            console.log(response);
            // as we have got the response from the server
            // we will get the new activeTaskId to update isTaskActive in Task component
            // so, we check if isTaskActive then set isTaskActiveLoading to false
          }
        });
    }
  };

  // whenever completedTimeInMilliseconds become greater than or equal to level_3 (last target time completed)
  // we call the addWorkedTimeSpan function
  // it checks that the task is active
  // then, registers the endTime property to the last workedTimeSpan object
  // and makes the task inactive
  if (completedTimeInMilliseconds >= level_3) {
    addWorkedTimeSpan(_id, lastTimeSpanIndex);
  }

  return (
    <div className={styles.iconWrapper}>
      <div
        className={styles.iconContainer}
        // add workedTimeSpan to workedTimeSpans array
        // and send _id of the task also the last element's index
        onClick={() => addWorkedTimeSpan(_id, lastTimeSpanIndex)}
      >
        {/* when the task is active and not disconnected => spin the border */}
        {/* it is covering the icon container and have a dashed border*/}
        <div
          className={`${styles.iconBorder}${isTaskActive && !isDisconnected ? ` ${styles.spin}` : ""
            }`}
        ></div>
        {isTaskActive && !isDisconnected ? (
          <FiPauseCircle
            size="1.5em"
            color="blueviolet"
            className={styles.icon}
          />
        ) : (
          <FiPlayCircle size="1.5em" color="#a5a5a5" className={styles.icon} />
        )}
      </div>
    </div>
  );
};


export default PlayPauseIcon;
