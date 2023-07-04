import Modal from "../../Shared/Modal/Modal";
import styles from "./DeleteTaskModal.module.css";
import Button from "../../Shared/Button/Button";


const DeleteTaskModal = ({ task, closeDeleteTaskModal }) => {
  const { name } = task;
  return (
    <Modal
      onClose={closeDeleteTaskModal}
      title="Delete Task"
    >
      {/* send modal body as children */}
      <div className={styles.modalBody}>
        <p>{name}</p>
        <Button className="btnLarge btnFullHeightWidth btnDanger">Delete</Button>
      </div>
    </Modal>
  )
};

export default DeleteTaskModal;
