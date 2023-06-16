import styles from "./NewTaskModal.module.css";
import globalStyles from "../../../styles/global.module.css";
import { useForm } from "react-hook-form";
import Button from "../../Shared/Button/Button";
import React from "react";
import { endOfToday, intervalToDuration } from "date-fns";
import useAuth from "../../../hooks/useAuth";

const NewTaskModal = ({ newTaskName, setNewTaskName }) => {
  // get the user from the context
  const { user } = useAuth();

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
  const remainingTime = intervalToDuration({
    start: new Date(),
    end: endOfToday(),
  });

  // create time durations for levels options
  const durationsToWork = [];
  // hours starts at 0 and ends at the remainingTime hours
  for (let hours = 0; hours <= remainingTime.hours; hours++) {
    // minutes starts at 0 and goes up to 50, increases by 10
    for (let minutes = 0; minutes <= 50; minutes += 10) {
      // if hours is equal to the remainingTime hours
      // then check if the minutes doesn't exceed the remainingTime minutes
      if (hours === remainingTime.hours) {
        if (minutes > remainingTime.minutes) break;
      }
      // push to the durationsToWork array
      durationsToWork.push({ hours, minutes });
    }
  }
  // remove the first element as it is {hours: 0, minutes: 0}
  durationsToWork.shift();

  // get the newTaskName from the NewTask component and set it as a form value
  const { register, handleSubmit } = useForm({
    defaultValues: {
      level_1: durationsToWork[0],
      level_2: durationsToWork[1],
      level_3: durationsToWork[2],
    },
  });

  // create new task
  const createNewTask = (data) => {
    const { level_1, level_2, level_3 } = data;

    const newTask = {
      // date here
      doer: user.username,
      name: newTaskName,
      workedTimeSpans: [],
      levels: {
        level_1,
        level_2,
        level_3,
      },
    };
    console.log(newTask);
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
          <form onSubmit={handleSubmit(createNewTask)}>
            <div className={styles.field}>
              <div className={styles.selectLabel}>
                <label className={styles.selectLabelText}>Level 1</label>
              </div>
              {/* ----------- level_1 field ------------ */}
              <select
                className={`${globalStyles.inputField} ${styles.inputField}`}
                {...register("level_1")}
              >
                {durationsToWork.map((duration) => (
                  <option key={Math.random()} value={duration}>
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
                {...register("level_2")}
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
              </select>
            </div>
            <div className={styles.field}>
              <div className={styles.selectLabel}>
                <label className={styles.selectLabelText}>Level 3</label>
              </div>
              {/* ------------ level_3 field ------------ */}
              <select
                className={`${globalStyles.inputField} ${styles.inputField}`}
                {...register("level_3")}
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
              </select>
            </div>
            <div className={styles.field}>
              <Button type="submit" className="btnHeightWidth100">
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
