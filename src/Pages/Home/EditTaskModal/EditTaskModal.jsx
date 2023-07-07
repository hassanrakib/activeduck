import Modal from "../../Shared/Modal/Modal";
import styles from "./EditTaskModal.module.css";
import { input, inputDashedBorder, inputBorderBottomOnly, inputNoBorderRadius } from "../../../styles/input.module.css";
import { useForm } from "react-hook-form";
import Button from "../../Shared/Button/Button";
import React from "react";
import Message from "../../Shared/Message/Message";
import WorkedTimeSpans from "../WorkedTimeSpans/WorkedTimeSpans";
import { socket } from "../../../socket";


const EditTaskModal = ({ task, activeTaskId, closeEditTaskModal }) => {
  // destructure
  const { _id, name, workedTimeSpans } = task;

  // get the _ids of workedTimeSpans that are marked for deletion
  const [deleteMarkedTimeSpansIds, setDeleteMarkedTimeSpansIds] = React.useState([]);

  // useForm hook of react hook form
  const { register, handleSubmit, formState: { errors }, setFocus } = useForm({
    defaultValues: {
      taskName: name,
    }
  });

  // set focus to the taskName input field for the first time render
  React.useEffect(() => {
    setFocus("taskName");
  }, [setFocus]);

  // edit task
  const editTask = (data) => {
    const updatedTaskName = data.taskName;
    // emit event to update the taskName
    // also send the activeTaskId to keep a task in active state (if it was active before update)
    socket.emit("taskName:update", _id, updatedTaskName, activeTaskId, (response) => {
      // after successfully updating the task name
      console.log(response);
    });

    // update the workedTimeSpans array
    // also send the activeTaskId to keep a task in active state (if it was active before update)
    socket.emit("workedTimeSpan:delete", _id, deleteMarkedTimeSpansIds, activeTaskId);

    // finally close the modal
    closeEditTaskModal();
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
        <WorkedTimeSpans
          workedTimeSpans={workedTimeSpans}
          // if deleteOption is true,
          // show every workedTimeSpan with a 'x' in button and add click event handler
          // also check that any workedTimeSpan's _id is in deleteMarkedTimeSpansIds state
          // to add 'btnDanger' class
          deleteOption={true}
          deleteMarkedTimeSpansIds={deleteMarkedTimeSpansIds}
          setDeleteMarkedTimeSpansIds={setDeleteMarkedTimeSpansIds}
        />
        {/* if task name is empty */}
        {
          errors.taskName && <Message error={errors.taskName.message} />
        }
        <div className={styles.buttons}>
          <Button className="btnMedium btnGrayBorder" handleClick={closeEditTaskModal}>Cancel</Button>
          <Button type="submit" className="btnMedium btnBlueviolet">Save</Button>
        </div>
      </form>
    </Modal>
  )
};

export default EditTaskModal;
