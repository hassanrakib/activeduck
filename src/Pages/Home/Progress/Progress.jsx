import styles from "./Progress.module.css";
const Progress = ({ isTaskActive, completedTimeInMilliseconds }) => {
  
  return (
    <div className={styles.progressContainer}>
      {/* move the tooltip as progress value increases by changing width */}
      {/* to understand more see the css styles */}
      <div className={styles.progressTooltip} style={{ width: "20%" }}>
        <span className={styles.progressTooltipText}>
          30m of 2h 30m completed
        </span>
      </div>
      <progress
        className={isTaskActive ? `${styles.animate}` : ""}
        max="100"
        value="20"
      ></progress>
    </div>
  );
};

export default Progress;
