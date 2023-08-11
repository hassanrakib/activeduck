import convertToHumanReadableTime from "../../../lib/convertToHumanReadableTime";
import styles from "./Progress.module.css";
const Progress = ({
  completedTimeInMs,
  isTaskActive,
  levels,
  currentLevel,
  isDisconnected
}) => {

  // destructure to get every level
  const { level_1, level_2, level_3 } = levels;

  
  // convert the completedTimeInMs to a human readable string that we show in the ui
  const completedTime = convertToHumanReadableTime(completedTimeInMs);

  // define targetTime and targetTimeInMilliseconds based on currentLevel
  // targetTime is human readable that we show in the ui
  let targetTime;
  // targetTimeInMilliseconds for progress tag's max attribute
  let targetTimeInMilliseconds;

  switch (currentLevel) {
    case "Level - 1":
      // convertToHumanReadable function takes current level's time in milliseconds
      // outputs a final human readable string to show in the ui
      targetTime = convertToHumanReadableTime(level_1);
      // targetTimeInMilliseconds holds the current level's time in milliseconds
      targetTimeInMilliseconds = level_1;
      break;
    case "Level - 2":
      targetTime = convertToHumanReadableTime(level_2);
      targetTimeInMilliseconds = level_2;
      break;
    case "Level - 3":
      targetTime = convertToHumanReadableTime(level_3);
      targetTimeInMilliseconds = level_3;
  }

  // calculate tooltip width by calculating
  // how much percentage is completedTimeInMs of the targetTimeInMilliseconds 
  const tooltipWidth = (completedTimeInMs * 100) / targetTimeInMilliseconds;


  return (
    <div className={styles.progressContainer}>
      {/* move the tooltip as progress value increases by changing width */}
      {/* to understand more see the css styles */}
      <div className={styles.progressTooltip} style={{ width: `${tooltipWidth}%` }}>
        <span className={styles.progressTooltipText}>
          {completedTime} of {targetTime} completed
        </span>
      </div>
      <progress
        className={isTaskActive && !isDisconnected ? `${styles.animate}` : ""}
        // max is the number of the targetTimeInMilliseconds and value is the completedTimeInMs
        max={targetTimeInMilliseconds}
        value={completedTimeInMs}
      ></progress>
    </div>
  );
};

export default Progress;