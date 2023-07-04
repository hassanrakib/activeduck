import Modal from "../../Shared/Modal/Modal";
import styles from "./DeleteTaskModal.module.css";


const DeleteTaskModal = ({ deletingTaskId, closeDeleteTaskModal }) => {
  return (
    <Modal
      onClose={closeDeleteTaskModal}
      title="Are you sure to delete the task?"
    >
      <p>Here is the task id: {deletingTaskId}</p>
    </Modal>
  )
};

export default DeleteTaskModal;
