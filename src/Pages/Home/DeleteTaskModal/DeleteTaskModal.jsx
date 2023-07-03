import Modal from "../../Shared/Modal/Modal";
import styles from "./DeleteTaskModal.module.css";


const DeleteTaskModal = ({deletingTaskId, setDeletingTaskId}) => {
  return (
    <Modal title="Are you sure to delete the task?" onClose={() => setDeletingTaskId("")}>
        <p>Here is the task id: {deletingTaskId}</p>
    </Modal>
  )
};

export default DeleteTaskModal
