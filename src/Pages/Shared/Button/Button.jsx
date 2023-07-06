import styles from "./Button.module.css";

const Button = ({
  type="button",
  handleClick = undefined,
  disabled = false,
  children,
  className,
}) => {
  // split the className prop value(string) by space and get classNames array
  const classNames = className?.split(" ");

  // default style of the button is in styles.btn class
  // so, we put it in classNamesStr variable before adding other class names from classNames array
  let classNamesStr = `${styles.btn}`;

  // add other class names to classNamesStr from classNames array
  classNames?.forEach(className => {
    classNamesStr += ` ${styles[className]}`
  });
  
  return (
    <button
      type={type}
      className={classNamesStr}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
