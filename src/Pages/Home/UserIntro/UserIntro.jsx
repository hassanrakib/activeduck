import styles from "./UserIntro.module.css";
import userImage from "../../../assets/avatar.jpg";
import { GiSandsOfTime } from "react-icons/gi";
import Avatar from "../../Shared/Avatar/Avatar";
const UserIntro = () => {
  return (
    <div className={styles.userIntro}>
      {/* user image */}
      <Avatar image={userImage} className="borderBlueViolet" />
      {/* user name and worked time*/}
      <p className={styles.userName}>
        <b>@elen_de</b> worked for <GiSandsOfTime color="blueviolet" />{" "}
        <span className={styles.totalTime}>8hours 30minutes</span>
      </p>
    </div>
  );
};

export default UserIntro;
