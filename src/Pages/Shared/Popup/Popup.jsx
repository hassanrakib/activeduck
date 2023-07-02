import styles from "./Popup.module.css";

const Popup = ({ children }) => {
    return (
        <div className={styles.popup}>
            {/* popup content goes here */}
            {children}
        </div>
    )
};

export default Popup;
