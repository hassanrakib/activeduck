import { Link, useLocation } from "react-router-dom";
import Button from "../../Shared/Button/Button";
import styles from "./Auth.module.css";
const Auth = () => {
  const location = useLocation();

  // redirect url is sent from the RequireAuth component
  const from = location.state?.from?.pathname || "/";

  return (
    <div className={styles.container}>
      <p className={styles.description}>
        A productive social media platform that makes you win your life.
      </p>
      <div className={styles.btns}>
        {/* send redirect url to the signin page */}
        <Link to="/auth/signin" state={{ from }} replace>
          <Button className="btnMedium btnBlueViolet">Signin</Button>
        </Link>
        <Link to="/auth/signup">
          <Button className="btnMedium btnBlueViolet">Signup</Button>
        </Link>
      </div>
    </div>
  );
};

export default Auth;
