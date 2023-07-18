import { Outlet} from "react-router-dom";
import styles from "./AuthLayout.module.css";
import {version} from "../../styles/version.module.css";

const AuthLayout = () => {

  return (
    <div className={styles.center}>
      <div className={styles.wrapper}>
        <header className={styles.logo}>zitbo<span className={version}>v 1.0</span></header>
        {/* main content */}
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
