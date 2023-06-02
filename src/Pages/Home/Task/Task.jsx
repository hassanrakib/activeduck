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
    <li
      className={`${styles.taskItem}${
        activeTaskId === _id ? ` ${styles.active}` : ""
      }${activeTaskId >= _id ? ` ${styles.tasksAboveActive}` : ""}`}
    >
      {/* play / pause icon absolute positioned */}
      <div
        className={styles.playPauseIcon}
        onClick={() => setActiveTaskIdFn(_id)}
      >
        {activeTaskId === _id ? (
          <FiPauseCircle size="1.5em" color="blueviolet" />
        ) : (
          <FiPlayCircle size="1.5em" color="#a5a5a5" />
        )}
      </div>
      <div className={styles.task}>
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
    </li>
  );
};

export default Task;
