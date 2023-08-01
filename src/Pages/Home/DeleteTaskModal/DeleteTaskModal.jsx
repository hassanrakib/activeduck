import Modal from "../../Shared/Modal/Modal";
import styles from "./DeleteTaskModal.module.css";
import Button from "../../Shared/Button/Button";
import convertToHumanReadableTime from "../../../lib/convertToHumanReadableTime";
import Message from "../../Shared/Message/Message";
import { socket } from "../../../socket";


const DeleteTaskModal = ({ task, currentLevel, completedTimeInMilliseconds, isTaskActive, closeDeleteTaskModal, indexInTasksOfDays }) => {
  // destructure
  const { name, _id } = task;

  // delete the task
  function deleteTask() {
    // emit "tasks:delete" event to delete the task
    socket.emit("tasks:delete", _id, isTaskActive, indexInTasksOfDays, (response) => {
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
