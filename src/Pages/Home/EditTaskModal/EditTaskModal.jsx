import Modal from "../../Shared/Modal/Modal";
import styles from "./EditTaskModal.module.css";
import { input, inputDashedBorder, inputBorderBottomOnly, inputNoBorderRadius } from "../../../styles/input.module.css";
import { useForm } from "react-hook-form";
import Button from "../../Shared/Button/Button";
import React from "react";
import Message from "../../Shared/Message/Message";
import WorkedTimeSpans from "../WorkedTimeSpans/WorkedTimeSpans";


const EditTaskModal = ({ task, closeEditTaskModal }) => {
  // destructure
  const { _id, name, workedTimeSpans } = task;

  // useForm hook of react hook form
  const { register, handleSubmit, formState: { errors }, setFocus } = useForm({
    defaultValues: {
      taskName: name,
    }
  });

  // set focus to the taskName input field for the first time render
  React.useEffect(() => {
    setFocus("taskName");
  })

  const editTask = (data) => {
    console.log(data);
  }

  return (
    <Modal
      onClose={closeEditTaskModal}
      title="Edit Task"
    >
      {/* modal body */}
      <form onSubmit={handleSubmit(editTask)} className={styles.modalBody}>
        <div className={styles.field}>
          <input
            className={`${input} ${inputDashedBorder} ${inputBorderBottomOnly} ${inputNoBorderRadius}`}
            {...register("taskName", { required: "Task name can't be empty!" })}
          />
        </div>
        {/* show workedTimeSpans with a 'x' in buttons */}
        <WorkedTimeSpans workedTimeSpans={workedTimeSpans} deleteOption={true} />
        {/* if task name is empty */}
        {
          errors.taskName && <Message error="Task name can't be empty" />
        }
        <div className={styles.buttons}>
          <Button className="btnMedium btnGrayBorder" handleClick={closeEditTaskModal}>Cancel</Button>
          <Button type="submit" className="btnMedium btnBlueviolet" handleClick={editTask}>Save</Button>
        </div>
      </form>
    </Modal>
  )
};

export default EditTaskModal;
