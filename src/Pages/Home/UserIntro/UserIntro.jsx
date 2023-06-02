import styles from "./UserIntro.module.css";
import userImage from "../../../assets/avatar.jpg";
import { GiSandsOfTime } from "react-icons/gi";
const UserIntro = () => {
  return (
    <div className={styles.userIntro}>
      {/* user image */}
      <div className={styles.avatarContainer}>
        <img className={styles.avatar} src={userImage} alt="avatar" />
      </div>
      {/* user name and worked time*/}
      <p className={styles.userName}>
        <b>Ellen DeGeneres</b> worked for <GiSandsOfTime color="blueviolet" />{" "}
        <span className={styles.totalTime}>8hours 30minutes</span>
      </p>
    </div>
  );
};

export default UserIntro;
