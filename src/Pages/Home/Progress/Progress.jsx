import { millisecondsToHours, millisecondsToMinutes } from "date-fns";
import styles from "./Progress.module.css";
import withTaskProgressCalculation from "../../../HOC/withTaskProgressCalculation";
const Progress = ({ completedTimeInMilliseconds, isTaskActive }) => {

  // converts the time in milliseconds to {hours: 3, minutes: 30} type object
  const converToDurationObject = (timeInMilliseconds) => {
    return {
      hours: millisecondsToHours(timeInMilliseconds),
      // removing the number of milliseconds for hours by using remainder operator
      // then the remaining milliseconds are converted to minutes 
      minutes: millisecondsToMinutes(timeInMilliseconds % (1000 * 60 * 60)),
    };
  };

  // convert the completedTimeInMilliseconds to a duration object like {hours: 2, minutes: 20};
  const completedTime = converToDurationObject(completedTimeInMilliseconds);

  console.log(completedTime);

  return (
    <div className={styles.progressContainer}>
      {/* move the tooltip as progress value increases by changing width */}
      {/* to understand more see the css styles */}
      <div className={styles.progressTooltip} style={{ width: "20%" }}>
        <span className={styles.progressTooltipText}>
          {completedTime.hours && `${completedTime.hours}h `}
          {`${completedTime.minutes}m`} of 2h 30m completed
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

export default withTaskProgressCalculation(Progress);
