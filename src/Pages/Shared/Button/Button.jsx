import styles from "./Button.module.css";

const Button = ({ type, handleClick, children, className = "" }) => {
  return (
    <button
      type={type}
      className={`${styles.btn} ${styles[className]}`}
      onClick={handleClick ? handleClick : undefined}
    >
      {children}
    </button>
  );
};

export default Button;
