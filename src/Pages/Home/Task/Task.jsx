import { FiPlayCircle } from "react-icons/fi";
import { FiPauseCircle } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import Button from "../../Shared/Button/Button";
import styles from "./Task.module.css";
const Task = ({
  task: { _id, name, workedSlots, totalTime },
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
        <div className={styles.timeSpent}>
          <span>4h 50m</span>
        </div>
        <div className={styles.taskDetailsWrapper}>
          <div className={styles.taskDetails}>
            <div className={styles.taskNameAndSettings}>
              <p>{name}</p>
              <BsThreeDots className={styles.taskSettings} />
            </div>
            <div className={styles.timeSlots}>
              {workedSlots?.map((slot) => (
                <Button key={Math.random()} className="smallBtn">
                  {slot}
                </Button>
              ))}
            </div>
          </div>
          <div className={styles.progress} style={{ width: "50%" }}>
            LEVEL 1 - 15m / 30m
          </div>
        </div>
      </div>
    </li>
  );
};

export default Task;
