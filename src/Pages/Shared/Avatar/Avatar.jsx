import styles from "./Avatar.module.css";
const Avatar = ({image}) => {
  return (
    <div className={styles.avatarContainer}>
      <img className={styles.avatar} src={image} alt="avatar" />
    </div>
  );
};

export default Avatar;
