import { Outlet } from "react-router-dom";
import Navbar from "../../Pages/Shared/Navbar/Navbar";
import styles from "./MainLayout.module.css"

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <div className={styles.wrapper}>
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
