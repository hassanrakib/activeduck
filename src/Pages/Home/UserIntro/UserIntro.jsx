import styles from "./UserIntro.module.css";
import userImage from "../../../assets/user.png";
import { GiSandsOfTime } from "react-icons/gi";
import Avatar from "../../Shared/Avatar/Avatar";
import useAuth from "../../../hooks/useAuth";
const UserIntro = ({totalCompletedTimes}) => {

  // get the user from the context
  const { user } = useAuth();

  return (
    <div className={styles.userIntro}>
      {/* user image */}
      <Avatar image={userImage} />
      {/* user name and worked time*/}
      <p className={styles.userName}>
        <b>@{user?.username}</b> worked for <GiSandsOfTime color="blueviolet" />{" "}
        <span className={styles.totalTime}>{totalCompletedTimes[0]}</span>
      </p>
    </div>
  );
};

export default UserIntro;
