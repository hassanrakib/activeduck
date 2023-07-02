import styles from "./Popup.module.css";

const Popup = ({ children, position }) => {
    return (
        <div className={`${styles.popup} ${styles[position]}`}>
            {/* popup content goes here */}
            {children}
        </div>
    )
};

export default Popup;
