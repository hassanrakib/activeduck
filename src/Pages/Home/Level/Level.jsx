import styles from "./Level.module.css";

const Level = ({ currentLevel }) => {
  return (
    <div className={styles.currentLevel}>
      <span>{currentLevel}</span>
    </div>
  );
};

export default Level;