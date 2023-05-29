import { Outlet } from "react-router-dom";
import styles from "./AuthLayout.module.css";


const AuthLayout = () => {
  return (
    <div className={styles.center}>
        <div className={styles.wrapper}>
            <header className={styles.logo}>zitbo</header>
            {/* main content */}
            <Outlet />
        </div>
    </div>
  )
};

export default AuthLayout;
