import styles from "./NewTask.module.css";
import globalStyles from "../../../styles/global.module.css";
import userImage from "../../../assets/avatar.jpg";
import Avatar from "../../Shared/Avatar/Avatar";
import Button from "../../Shared/Button/Button";
import NewTaskModal from "../NewTaskModal/NewTaskModal";
import React from "react";

const NewTask = () => {
  const [newTaskName, setNewTaskName] = React.useState("");

  const openNewTaskModal = (e) => {
    e.preventDefault();
    const form = e.target;
    setNewTaskName(form.newTaskName.value);
    
    // make the form field blur and reset
    form.blur();
    form.reset();
  }

  return (
    <div className={styles.newTask}>
      <Avatar image={userImage} className="borderBlueViolet" />
      <form onSubmit={openNewTaskModal}>
        <div className={styles.field}>
          <input
            className={`${globalStyles.inputField} ${styles.inputField}`}
            type="text"
            name="newTaskName"
            placeholder="Enter your task"
            required
          />
          <Button type="submit" className="newTaskSpecific">
            Create
          </Button>
        </div>
      </form>
      {/* show modal when clicked create button */}
      {newTaskName && (
        <NewTaskModal
          newTaskName={newTaskName}
          setNewTaskName={setNewTaskName}
        />
      )}
    </div>
  );
};

export default NewTask;
