import { formatDuration, millisecondsToHours, millisecondsToMinutes } from "date-fns";
import styles from "./Progress.module.css";
import withTaskProgressCalculation from "../../../HOC/withTaskProgressCalculation";
const Progress = ({
  completedTimeInMilliseconds,
  isTaskActive,
  levels,
  currentLevel,
}) => {
  // destructure to get every level
  const { level_1, level_2, level_3 } = levels;

  // converts the time in milliseconds to {hours: 3, minutes: 30} type object
  // then return a human readable string that uses the object
  const convertToHumanReadableTime = (timeInMilliseconds) => {
    const duration = {
      hours: millisecondsToHours(timeInMilliseconds),
      // removing the number of milliseconds for hours by using remainder operator
      // then the remaining milliseconds are converted to minutes
      minutes: millisecondsToMinutes(timeInMilliseconds % (1000 * 60 * 60)),
    };
    
    return formatDuration(duration);
  };

  // convert the completedTimeInMilliseconds to a human readable string that we show in the ui
  const completedTime = convertToHumanReadableTime(completedTimeInMilliseconds);

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
  // how much percentage is completedTimeInMilliseconds of the targetTimeInMilliseconds 
  const tooltipWidth = (completedTimeInMilliseconds * 100) / targetTimeInMilliseconds;


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
        className={isTaskActive ? `${styles.animate}` : ""}
        // max is the number of the  and value is the completedTime
        max={targetTimeInMilliseconds}
        value={completedTimeInMilliseconds}
      ></progress>
    </div>
  );
};

const EnhancedProgress = withTaskProgressCalculation(Progress);
export default EnhancedProgress;
