import { IoMdAlert } from "react-icons/io";
import styles from "./Error.module.css";

const Error = ({message}) => {
  return (
    <div className={styles.errorContainer}>
      <IoMdAlert color="#d50000" size="20px" />
      <span className={styles.errorMessage}>{message}</span>
    </div>
  );
};

export default Error;
