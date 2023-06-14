import { Link, useLocation } from "react-router-dom";
import Button from "../../Shared/Button/Button";
import styles from "./Auth.module.css";
const Auth = () => {

  const location = useLocation();
  const from = location.state?.from?.pathname || "/"; 

  return (
    <div className={styles.container}>
      <p className={styles.description}>
        A productive social media platform that makes you win your life.
      </p>
      <div className={styles.btns}>
        <Link to="/auth/signin" state={{from}} replace>
          <Button>Signin</Button>
        </Link>
        <Link to="/auth/signup">
          <Button>Signup</Button>
        </Link>
      </div>
    </div>
  );
};

export default Auth;
