import styles from "./Avatar.module.css";
const Avatar = ({image, className}) => {
  return (
    <div className={`${styles.avatarContainer} ${styles[className]}`}>
      <img className={styles.avatar} src={image} alt="avatar" />
    </div>
  );
};

export default Avatar;
