import styles from "./NewTaskModal.module.css";
import globalStyles from "../../../styles/global.module.css";
import Button from "../../Shared/Button/Button";
import React from "react";
import { endOfToday, intervalToDuration } from "date-fns";
import { socket } from "../../../socket";

const NewTaskModal = ({
  newTaskName,
  setNewTaskName,
  setTaskCreationResult,
}) => {
  // all the levels show the first options of their arrays by default
  const [levels, setLevels] = React.useState({
    level_1: 0,
    level_2: 0,
    level_3: 0,
  });

  // initial remaining time when component is first mounted
  // used in creating durations for levels
  const [remainingTime, setRemainingTime] = React.useState(
    intervalToDuration({
      start: new Date(),
      end: endOfToday(),
    })
  );

  // modalContentRef.current has the modalContent dom element
  const modalContentRef = React.useRef(null);

  // close modal when clicked outside of the modal content
  React.useEffect(() => {
    // handleClickOutside function checks that the click is inside modal content or not
    const handleClickOutside = (e) => {
      // if modalContentRef.current doesn't contain clicked element(e.target) then close modal
      // that means the clicked event is happened outside modal content
      if (!modalContentRef.current.contains(e.target)) setNewTaskName("");
    };

    // add click event listener to the document
    // when user clicks anywhere in the document
    // handleClickOutside function is called
    document.addEventListener("click", handleClickOutside);
    return () => {
      // cleanup event listener
      document.removeEventListener("click", handleClickOutside);
    };
  }, [setNewTaskName]);

  // get the remaining time of the day using date-fns
  // returns {days: 0, hours: 10, minutes: 20, seconds: 1}
  React.useEffect(() => {
    // creates an interval that update remaining time every 5 minutes
    const interval = setInterval(() => {
      // before updating remaining time, we have to reset level_3 index
      // because, every update will delete the last duration object from level_1_durations array
      // index of the deleted duration might have previously selected in the level_3
      // so, creating new task may get a level_3 undefined when finding duration with that index
      setLevels((prevLevels) => ({ ...prevLevels, level_3: 0 }));
      // update remaining time
      setRemainingTime(
        intervalToDuration({
          start: new Date(),
          end: endOfToday(),
        })
      );
    }, 300000);

    // cleanup
    return () => clearInterval(interval);
  }, [levels]);

  // get durations to work using remaining time for level_1
  // if remainingTime updates, level_1_durations will change as well
  const level_1_durations = React.useMemo(() => {
    // create time durations for levels options
    const durations = [];
    // hours starts at 0 and ends at the remainingTime hours
    for (let hours = 0; hours <= remainingTime.hours; hours++) {
      // minutes starts at 0 and goes up to 50, increases by 10
      for (let minutes = 0; minutes <= 55; minutes += 5) {
        // if hours is equal to the remainingTime hours
        // then check if the minutes doesn't exceed the remainingTime minutes
        if (hours === remainingTime.hours) {
          if (minutes > remainingTime.minutes) break;
        }
        // push to the level_1_durations array
        durations.push({ hours, minutes });
      }
    }
    // remove the first element as it is {hours: 0, minutes: 0}
    durations.shift();

    return durations;
  }, [remainingTime]);

  // get durations for level_2 using level_1, slicing to create another array
  // slicing after the level_1's current duration index to the end
  const level_2_durations = level_1_durations.slice(
    levels.level_1 + 1,
    level_1_durations.length
  );

  // get durations for level_3 using level_2, slicing to create another array
  // slicing after the level_2's current duration index to the end
  const level_3_durations = level_2_durations.slice(
    levels.level_2 + 1,
    level_2_durations.length
  );

  // update of remaining time will make durations arrays gradually empty
  // true, if any of the durations arrays is empty
  const durationsArrayEmpty = !(
    level_1_durations.length &&
    level_2_durations.length &&
    level_3_durations.length
  );

  // create new task
  const createNewTask = (e) => {
    e.preventDefault();

    // get duration's index
    const { level_1, level_2, level_3 } = levels;


    // so, if any of the array is empty we will not create new task
    // as, multiple levels can be undefined when finding duration with index
    if (!durationsArrayEmpty) {
      const newTask = {
        // add date and doer(username of the user) in the server side
        name: newTaskName,
        workedTimeSpans: [],
        levels: {
          // getting values from arrays by the levels' indexes
          level_1: level_1_durations[level_1], // ex: {hours: 1, minutes: 30}
          level_2: level_2_durations[level_2],
          level_3: level_3_durations[level_3],
        },
      };

      // send newTask to the server to store it in db
      // 5000ms to complete the operation and get the response
      // otherwise error will be recieved by socket (error generated automatically)
      // you just send response from BE after successful operation
      socket.timeout(5000).emit("tasks:create", newTask, (err, result) => {
        if (err) {
          // if error happens creating new task set taskCreationResult state
          setTaskCreationResult({ error: "Failed to create the task" });
        } else {
          // if successful in creating new task set taskCreationResult to the result from BE
          setTaskCreationResult(result);
        }
      });

      // close the modal after clicking create button
      setNewTaskName("");
    }
  };

  return (
    <div className={styles.modal}>
      {/* ----------- modal content ------------ */}
      <div className={styles.modalContent} ref={modalContentRef}>
        {/* ----------- modal header ------------ */}
        <div className={styles.modalHeader}>
          {/* ----------- what user wants to do ------------ */}
          <h1 className={styles.heading}>I want to {newTaskName}</h1>
          {/* ----------- close modal by setting newTaskName to empty string ------------ */}
          <span className={styles.close} onClick={() => setNewTaskName("")}>
            &times;
          </span>
        </div>
        {/* ----------- modal body ------------ */}
        <div className={styles.modalBody}>
          {/* ----------- create new task ------------ */}
          <form onSubmit={createNewTask}>
            <div className={styles.field}>
              <div className={styles.selectLabel}>
                <label className={styles.selectLabelText}>Level 1</label>
              </div>
              {/* ----------- level_1 field ------------ */}
              <select
                className={`${globalStyles.inputField} ${styles.inputField}`}
                name="level_1"
                value={levels.level_1}
                // when change happens to level_1 index , clear indexs of the next levels to 0
                onChange={(e) =>
                  setLevels({
                    level_1: parseInt(e.target.value),
                    level_2: 0,
                    level_3: 0,
                  })
                }
              >
                {level_1_durations.map((duration, index) => (
                  // keeping duration's index in the value to get the actual object later
                  <option key={Math.random()} value={index}>
                    {duration.hours > 0 && `${duration.hours} hours `}
                    {duration.minutes > 0 && `${duration.minutes} minutes`}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <div className={styles.selectLabel}>
                <label className={styles.selectLabelText}>Level 2</label>
              </div>
              {/* ----------- level_2 field ------------ */}
              <select
                className={`${globalStyles.inputField} ${styles.inputField}`}
                name="level_2"
                value={levels.level_2}
                // when change happens to level_2 index , clear indexs of the next levels to 0

                onChange={(e) =>
                  setLevels((prevLevels) => ({
                    ...prevLevels,
                    level_2: parseInt(e.target.value),
                    level_3: 0,
                  }))
                }
              >
                {level_2_durations.map((duration, index) => (
                  // keeping duration's index in the value to get the actual object later
                  <option key={Math.random()} value={index}>
                    {duration.hours > 0 && `${duration.hours} hours `}
                    {duration.minutes > 0 && `${duration.minutes} minutes`}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <div className={styles.selectLabel}>
                <label className={styles.selectLabelText}>Level 3</label>
              </div>
              {/* ------------ level_3 field ------------ */}
              <select
                className={`${globalStyles.inputField} ${styles.inputField}`}
                name="level_3"
                value={levels.level_3}
                onChange={(e) =>
                  setLevels((prevLevels) => ({
                    ...prevLevels,
                    level_3: parseInt(e.target.value),
                  }))
                }
              >
                {level_3_durations.map((duration, index) => (
                  // keeping duration's index in the value to get the actual object later
                  <option key={Math.random()} value={index}>
                    {duration.hours > 0 && `${duration.hours} hours `}
                    {duration.minutes > 0 && `${duration.minutes} minutes`}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              {/* disable the button if any durations array is empty */}
              <Button type="submit" className="btnHeightWidth100" disabled={durationsArrayEmpty}>
                Create
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewTaskModal;
