import withTaskProgressCalculation from "../../../HOC/withTaskProgressCalculation";
import styles from "./Level.module.css";

const Level = ({ currentLevel }) => {
  return (
    <div className={styles.currentLevel}>
      <span>{currentLevel}</span>
    </div>
  );
};

const EnhancedLevel = withTaskProgressCalculation(Level);

export default EnhancedLevel;
