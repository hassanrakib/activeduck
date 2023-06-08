import { FaCheck } from "react-icons/fa";
import styles from "./ProgressBar.module.css";

// three steps to form submit
const steps = [
  { name: "Username", number: 1 },
  { name: "Email", number: 2 },
  { name: "Password", number: 3 },
];
// current page is the current page index
const ProgressBar = ({ currentPage }) => {
  return (
    <div className={styles.progressBar}>
      {steps.map((step) => (
        <div
          key={step.number}
          className={`${styles.step}${
            // currentPage greater than the step number means the step is completed
            // add active class
            currentPage > step.number? ` ${styles.active}` : ""
          }`}
        >
          <p className={styles.stepName}>{step.name}</p>
          <div className={styles.bullet}>
            <span className={styles.bulletNumber}>{step.number}</span>
          </div>
          <FaCheck size="15px" className={styles.check} />
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
