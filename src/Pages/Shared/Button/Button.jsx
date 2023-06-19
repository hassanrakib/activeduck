import styles from "./Button.module.css";

const Button = ({
  type,
  handleClick = undefined,
  disabled = false,
  children,
  className,
}) => {
  return (
    <button
      type={type}
      className={`${styles.btn} ${styles[className]}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
