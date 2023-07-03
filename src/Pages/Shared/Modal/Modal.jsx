import styles from "Modal.module.css";


const Modal = ({ children }) => {
  return (
    <div className={styles.modal}>
      {/* ----------- modal content ------------ */}
      <div className={styles.modalContent} ref={modalContentRef}>
        {children}
      </div>
    </div>
  )
};

// subcomponents
const Heading = ({ children }) => (
  <div className={styles.modalHeader}>
    {/* ----------- Modal Heading ------------ */}
    <h1 className={styles.heading}>{children}</h1>
    {/* ----------- close modal by setting newTaskName to empty string ------------ */}
    <span className={styles.close} onClick={() => setNewTaskName("")}>
      &times;
    </span>
  </div>
);

Modal.Heading = Heading;

const Body = ({ children }) => (
  <div className={styles.modalBody}>
    {children}
  </div>
);

Modal.Body = Body;


export default Modal;