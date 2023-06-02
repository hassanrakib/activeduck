import TaskList from "../TaskList/TaskList";
import UserIntro from "../UserIntro/UserIntro";
import styles from "./UserStatus.module.css";
const UserStatus = () => {
  return (
    <div className={styles.userStatus}>
        {/* user ranking */}
        <div className={styles.ranking}>1</div>
        {/* user introduction with total working time */}
        <UserIntro />
        <TaskList />
    </div>
  )
};

export default UserStatus
