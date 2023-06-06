import NewTask from "../NewTask/NewTask";
import UserStatus from "../UserStatus/UserStatus";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <div className={styles.container}>
      <NewTask />
      <UserStatus />
    </div>
  )
};

export default Home
