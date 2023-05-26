import { IoMdAlert } from "react-icons/io";
import styles from "./Message.module.css";
import { FaRegCheckCircle } from "react-icons/fa";

const Message = ({ error, success }) => {
  return (
    <div className={styles.container}>
      {error ? (
        <IoMdAlert color="#d50000" size="20px" />
      ) : (
        <FaRegCheckCircle color="gray" size="2em" />
      )}
      <span className={error ? styles.errorMessage : ""}>
        {error || success}
      </span>
    </div>
  );
};

export default Message;
