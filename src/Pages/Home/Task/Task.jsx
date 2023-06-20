import { FiPlayCircle } from "react-icons/fi";
import { FiPauseCircle } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import Button from "../../Shared/Button/Button";
import styles from "./Task.module.css";
import zzz from "../../../assets/zzz.gif";
const Task = ({
  task: { _id, name, workedTimeSpans },
  activeTaskId,
  setActiveTaskIdFn,
}) => {
  return (
    <li className={styles.taskItem}>
      {/* play / pause icon wrapper absolute positioned */}
      <div className={styles.iconWrapper}>
        <div
          className={styles.iconContainer}
          // set activeTaskId state
          onClick={() => setActiveTaskIdFn(_id)}
        >
          {/* when the task is active, spin the border */}
          {/* it is covering the icon container and have a dashed border*/}
          <div
            className={`${styles.iconBorder}${
              activeTaskId === _id ? ` ${styles.spin}` : ""
            }`}
          ></div>
          {activeTaskId === _id ? (
            <FiPauseCircle
              size="1.5em"
              color="blueviolet"
              className={styles.icon}
            />
          ) : (
            <FiPlayCircle
              size="1.5em"
              color="#a5a5a5"
              className={styles.icon}
            />
          )}
        </div>
      </div>
      <div className={styles.task}>
        <div className={styles.currentLevel}>
          <span>Level - 1</span>
        </div>
        <div className={styles.taskDetailsWrapper}>
          <div className={styles.taskDetails}>
            <div className={styles.taskNameAndSettings}>
              <p>{name}</p>
              <BsThreeDots className={styles.taskSettings} />
            </div>
            {workedTimeSpans.length === 0 ? (
              // if not worked show image
              <div className={styles.zzzContainer}>
                <img className={styles.zzz} src={zzz} alt="sleeping" />
              </div>
            ) : (
              <div className={styles.timeSpans}>
                {/* show workedTimeSpans */}
                {workedTimeSpans?.map((timeSpan) => (
                  <Button key={Math.random()} className="timeSpan">
                    {timeSpan}
                  </Button>
                ))}
              </div>
            )}
          </div>
          <div className={styles.progressContainer}>
            {/* move the tooltip as progress value increases by changing width */}
            {/* to understand more see the css styles */}
            <div className={styles.progressTooltip} style={{ width: "20%" }}>
              <span className={styles.progressTooltipText}>
                30m of 2h 30m completed
              </span>
            </div>
            <progress
              className={activeTaskId === _id ? `${styles.animate}` : ""}
              max="100"
              value="20"
            ></progress>
          </div>
        </div>
      </div>
    </li>
  );
};

export default Task;
