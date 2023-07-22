import NewTask from "../NewTask/NewTask";
import UserStatusList from "../UserStatusList/UserStatusList";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <div className={styles.container}>
      <NewTask />
      <UserStatusList />
    </div>
  )
};

export default Home
