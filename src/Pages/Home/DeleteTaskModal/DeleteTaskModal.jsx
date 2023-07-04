import { AiOutlineDelete } from "react-icons/ai";
import Modal from "../../Shared/Modal/Modal";
import styles from "./DeleteTaskModal.module.css";
import Button from "../../Shared/Button/Button";


const DeleteTaskModal = ({ deletingTaskId, closeDeleteTaskModal }) => {
  return (
    <Modal
      onClose={closeDeleteTaskModal}
    >
      {/* send modal body as children */}
      <div className={styles.modalBody}>
        {/* delete icon */}
        <div className={styles.deleteIconContainer}>
          <AiOutlineDelete size="3em" />
        </div>
        <h1>Are you sure to delete,</h1>
        <p>Read official documentation of socket.io?</p>
        <Button className="btnLarge btnDanger">Delete</Button>
      </div>
    </Modal>
  )
};

export default DeleteTaskModal;
