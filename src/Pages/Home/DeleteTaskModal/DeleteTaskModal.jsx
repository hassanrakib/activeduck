import Modal from "../../Shared/Modal/Modal";
import styles from "./DeleteTaskModal.module.css";
import Button from "../../Shared/Button/Button";
import convertToHumanReadableTime from "../../../lib/convertToHumanReadableTime";
import Message from "../../Shared/Message/Message";
import { socket } from "../../../socket";


const DeleteTaskModal = ({ task, activeTaskId, currentLevel, completedTimeInMilliseconds, isTaskActive, closeDeleteTaskModal, indexInTasksOfDays }) => {
  // destructure
  const { name, _id } = task;

  // delete the task
  function deleteTask() {
    // if the task is active, then after delete there will be no activeTaskId
    // that's why sending empty string
    // if the task is not active, then any other task might be active
    // that's why sending activeTaskId
    const activeTaskIdToSend = isTaskActive ? "" : activeTaskId;

    // emit "tasks:delete" event to delete the task
    socket.emit("tasks:delete", _id, activeTaskIdToSend, indexInTasksOfDays, (response) => {
      console.log(response.message);
    });
  }

  return (
    <Modal
      onClose={closeDeleteTaskModal}
      title="Delete Task"
    >
      {/* send modal body as children */}
      <div className={styles.modalBody}>
        <h3>{name}</h3>
        <Message error="The following progress will be lost!" withBackgroundColor={true} />
        <ul className={styles.progressList}>
          <li>Level: {currentLevel}</li>
          <li>Completed Time: {convertToHumanReadableTime(completedTimeInMilliseconds)}</li>
        </ul>
        <div className={styles.buttons}>
          <Button className="btnMedium btnBlueviolet" handleClick={closeDeleteTaskModal}>Cancel</Button>
          <Button className="btnMedium btnDanger" handleClick={deleteTask}>Delete</Button>
        </div>
      </div>
    </Modal>
  )
};

export default DeleteTaskModal;
