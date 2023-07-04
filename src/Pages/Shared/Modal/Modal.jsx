import styles from "./Modal.module.css";
import React from "react";


const Modal = ({ onClose, title, children }) => {

  // close modal when clicked outside of the modal content
  React.useEffect(() => {
    // handleClickOutside function checks that the click is inside modal content or not
    const handleClickOutside = (e) => {
      console.log(e.target);
      // The closest() method searches up the DOM tree for elements which matches a specified CSS selector
      // here, if clicked outside of modalContent, no matched Element will be found
      // so, close the modal
      if (!e.target.closest(`.${styles.modalContent}`)) {
        console.log("Closing the modal");
        onClose();
      }
    };

    // add mousedown event listener to the document instead of click
    // the button that opens the modal doesn't finishes click before the modal is rendered
    // so click event executes the handleClickOutside function in modal component and closes modal
    // when user clicks anywhere in the document
    // handleClickOutside function is called
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // cleanup event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className={styles.modal}>
      {/* ----------- modal content ------------ */}
      <div className={styles.modalContent}>
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