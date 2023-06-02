import UserStatus from "../UserStatus/UserStatus";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <div className={styles.container}>
      <UserStatus />
    </div>
  )
};

export default Home
