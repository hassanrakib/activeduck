import { FaCheck } from "react-icons/fa";
import styles from "./ProgressBar.module.css";

const steps = [
  { name: "Name", number: 1 },
  { name: "Email", number: 2 },
  { name: "Password", number: 3 },
];
const ProgressBar = ({ currentPage }) => {
  return (
    <div className={styles.progressBar}>
      {steps.map((step) => (
        <div
          key={step.number}
          className={`${styles.step}${
            currentPage > step.number? ` ${styles.active}` : ""
          }`}
        >
          <p className={styles.stepName}>{step.name}</p>
          <div className={styles.bullet}>
            <span className={styles.bulletNumber}>{step.number}</span>
          </div>
          <FaCheck className={styles.check} />
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
