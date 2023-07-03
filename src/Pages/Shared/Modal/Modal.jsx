import styles from "./Modal.module.css";
import React from "react";


const Modal = ({ onClose, title, children }) => {

  console.log("modal component");

  // modalContentRef.current has the modalContent dom element
  const modalContentRef = React.useRef(null);

  // close modal when clicked outside of the modal content
  React.useEffect(() => {
    // handleClickOutside function checks that the click is inside modal content or not
    const handleClickOutside = (e) => {
      // if modalContentRef.current doesn't contain clicked element(e.target) then close modal
      // that means the clicked event is happened outside modal content
      if (!modalContentRef.current.contains(e.target)) onClose();
    };

    // add click event listener to the document
    // when user clicks anywhere in the document
    // handleClickOutside function is called
    document.addEventListener("click", handleClickOutside);
    return () => {
      // cleanup event listener
      document.removeEventListener("click", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className={styles.modal}>
      {/* ----------- modal content ------------ */}
      <div className={styles.modalContent} ref={modalContentRef}>
        {/* modal header */}
        <div className={styles.modalHeader}>
          {/* ----------- modal title ------------ */}
          <h1 className={styles.title}>{title}</h1>
          {/* ----------- close modal by calling onClose function ------------ */}
          <span className={styles.close} onClick={() => onClose()}>
            &times;
          </span>
        </div>
        {/* modal body recieved as children */}
        <div className={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  )
};

export default Modal;