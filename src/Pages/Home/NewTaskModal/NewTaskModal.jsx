import styles from "./NewTaskModal.module.css";
import globalStyles from "../../../styles/global.module.css";
import { useForm } from "react-hook-form";
import Button from "../../Shared/Button/Button";
import React from "react";

const NewTaskModal = ({ newTaskName, setNewTaskName }) => {
  const modalContentRef = React.useRef(null);

  const {register, handleSubmit} = useForm({
    defaultValues: {
      name: newTaskName,
    }
  })

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      // if modalContentRef.current doesn't contain e.target node then close modal
      if(!modalContentRef.current.contains(e.target)) setNewTaskName("");
    }

    document.addEventListener("click", handleClickOutside);
    return () => {document.removeEventListener("click", handleClickOutside)};
  }, [setNewTaskName]);

  const createNewTask = (data) => {
    console.log(data);
  }

  return (
    <div className={styles.modal}>
      {/* modal content */}
      <div className={styles.modalContent} ref={modalContentRef}>
        <div className={styles.modalHeader}>
          <h1>Create Task</h1>
          <span className={styles.close} onClick={() => setNewTaskName("")}>
            &times;
          </span>
        </div>
        <div className={styles.modalBody}>
          <form onSubmit={handleSubmit(createNewTask)}>
            <div className={styles.field}>
              <label className={styles.label}>Your Task</label>
              <input className={globalStyles.inputField} type="text" {...register("name", {required: true})} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Level 1</label>
              <select className={globalStyles.inputField} {...register("level-1")}>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Level 2</label>
              <select className={globalStyles.inputField} {...register("level-2")}>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Level 3</label>
              <select className={globalStyles.inputField} {...register("level-3")}>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
              </select>
            </div>
            <div className={styles.field}>
              <Button type="submit" className="btnHeightWidth100">Create</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewTaskModal;
