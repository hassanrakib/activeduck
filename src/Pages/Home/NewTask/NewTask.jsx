import styles from "./NewTask.module.css";
import globalStyles from "../../../styles/global.module.css";
import userImage from "../../../assets/user.png";
import Avatar from "../../Shared/Avatar/Avatar";
import Button from "../../Shared/Button/Button";
import NewTaskModal from "../NewTaskModal/NewTaskModal";
import React from "react";
import Message from "../../Shared/Message/Message";

const NewTask = () => {
  // newTaskName is sent to the NewTaskModal
  const [newTaskName, setNewTaskName] = React.useState("");

  // by default taskCreationResult is null, so that message doesn't show up
  const [taskCreationResult, setTaskCreationResult] = React.useState(null);

  // set taskCreationResult to null after 10000ms
  // as we don't want to show the result after 5000ms
  if (taskCreationResult) {
    setTimeout(() => {
      setTaskCreationResult(null);
    }, 10000);
  }

  const openNewTaskModal = (e) => {
    e.preventDefault();
    const form = e.target;
    // setting task name opens the modal
    setNewTaskName(form.newTaskName.value);

    // make the form field blur
    form.newTaskName.blur();
    // reset the form after submit
    form.reset();
  };

  return (
    <div className={styles.newTask}>
      <Avatar image={userImage} />
      <form onSubmit={openNewTaskModal}>
        <div className={styles.field}>
          <input
            className={`${globalStyles.inputField} ${styles.inputField}`}
            type="text"
            name="newTaskName"
            placeholder="Enter your task"
            required
          />
          <Button type="submit" className="createTaskBtn btnBlueviolet">
            Create
          </Button>
        </div>
      </form>

      {/* show message if taskCreationResult has success property */}
      {taskCreationResult?.success && (
        <div className={`${styles.message} ${styles.success}`}>
          <Message success={taskCreationResult.success} />
        </div>
      )}

      {/* show message if taskCreationResult has error property */}
      
      {taskCreationResult?.error && (
        <div className={`${styles.message} ${styles.error}`}>
          <Message error={taskCreationResult.error} />
        </div>
      )}

      {/* show modal when clicked create button in the NewTask component */}
      {/* create button assign newTaskName, when newTaskName exists show modal */}
      {newTaskName && (
        <NewTaskModal
          newTaskName={newTaskName}
          setNewTaskName={setNewTaskName}
          setTaskCreationResult={setTaskCreationResult}
        />
      )}
    </div>
  );
};

export default NewTask;
