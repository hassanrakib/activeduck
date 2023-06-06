import styles from "./Button.module.css";

const Button = ({ type, handleClick = undefined, children, className }) => {
  return (
    <button
      type={type}
      className={`${styles.btn} ${styles[className]}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default Button;
