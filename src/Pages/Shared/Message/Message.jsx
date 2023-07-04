import { IoMdAlert } from "react-icons/io";
import styles from "./Message.module.css";
import { FaRegCheckCircle } from "react-icons/fa";

const Message = ({ error, success, withBackgroundColor = false }) => {
  return (
    <div
      className={`${withBackgroundColor ? error ? ` ${styles.errorBg} ${styles.withBackground}` : ` ${styles.successBg}  ${styles.withBackground}` : ""}`}>
      {error ? (
        <IoMdAlert color="#D8000C" className={styles.icon} />
      ) : (
        <FaRegCheckCircle color="#270" className={styles.icon} />
      )}
      <span className={error ? styles.errorMessage : ""}>
        {error || success}
      </span>
    </div>
  );
};

export default Message;
