import styles from "./Button.module.css";

const Button = ({ type, onClick, onClickArg, children, className = "" }) => {
  return (
    <button
      type={type}
      className={`${styles.btn} ${styles[className]}`}
      onClick={onClick ? () => onClick(onClickArg) : undefined}
    >
      {children}
    </button>
  );
};

export default Button;
