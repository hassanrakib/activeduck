import {
  formContainer,
  formTitle,
  formOuter,
  form,
  page,
  field,
  flexContainer,
  columnGap,
} from "../../../styles/signup-signin.module.css";
import inputStyles from "../../../styles/input.module.css";
import Message from "../../Shared/Message/Message";
import Button from "../../Shared/Button/Button";
import Loader from "../../Shared/Loader/Loader";
import withMultiStepAuthentication from "../../../HOC/withMultiStepAuthentication";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { useEffect } from "react";
import { socket } from "../../../socket";

const SignIn = ({
  currentPage,
  handleSubmit,
  onSubmit,
  firstPageStyle,
  register,
  validateInputSetCurrentPage,
  setCurrentPage,
  errors,
  // indicates whether sign in operations still in progress
  loading: signInOperationLoading,
  error: signInOperationError,
  token,
}) => {
  // we request for the user from db in AuthProvider
  // while doing sign in operation
  // getting user from db may take more time than sign in operations
  // userLoading is used to know that the get user from db in progress or not
  const {
    loading: userLoading,
    setLoading: setUserLoading,
    user,
    setToken,
  } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  // redirect url is sent from the Auth Page
  const from = location.state?.from || "/";

  useEffect(() => {
    // if user is previously signed in to firebase and we are successful in getting the user from db
    // then observer will not be called again after signin => using token or firebase sign in
    // as a result, userLoading will remain true,
    // that's why we need to set userLoading to false from here
    if(user) {
      setUserLoading(false);
    }

    // if new token is recieved and user also recieved from database by using previous token 
    if (token && user) {
      navigate(from, { replace: true });
    } else if (token) {
      // set token to call the observer again after getting token
      // so that, we get user with valid token and previous if block executes
      setToken(token);
    }
  }, [token, user, setUserLoading, setToken, from, navigate]);

  return (
    <div className={formContainer}>
      {/* form header */}
      <h1 className={formTitle}>Sign in</h1>
      <div className={formOuter}>
        {/* hook form handleSubmit takes care of submit event */}
        <form className={form} onSubmit={handleSubmit(onSubmit)}>
          {/* move the first page based on currentPage */}
          <div className={page} style={firstPageStyle}>
            <div className={field}>
              <input
                className={inputStyles.input}
                type="text"
                {...register("form.email", {
                  required: "The field is required",
                })}
                placeholder="Enter your email"
                onKeyUp={(e) =>
                  e.key === "Enter" &&
                  validateInputSetCurrentPage(2, "form.email")
                }
              />
            </div>
            {errors?.form?.email && (
              <Message error={errors.form.email.message} />
            )}
            <div className={`${field}`}>
              <Button
                className="btnFullHeightWidth btnLarge btnBlueviolet"
                handleClick={() => validateInputSetCurrentPage(2, "form.email")}
              >
                Next
              </Button>
            </div>
          </div>

          {/* second page */}
          <div className={page}>
            <div className={field}>
              <input
                className={inputStyles.input}
                type="password"
                {...register("form.password", {
                  required: "The field is required",
                })}
                placeholder="Enter your password"
              />
            </div>
            {errors?.form?.password && (
              <Message error={errors.form.password.message} />
            )}
            <div className={`${field} ${flexContainer} ${columnGap}`}>
              <Button
                className="btnFullHeightWidth btnLarge btnBlueviolet"
                handleClick={() => setCurrentPage(1)}
              >
                Previous
              </Button>
              <Button
                className="btnFullHeightWidth btnLarge btnBlueviolet"
                // stop submitting form by clicking enter from page other than page index two
                // last button click done by submit, so, watch onSubmit

                type={currentPage === 2 ? "submit" : "button"}
              >
                Signin
              </Button>
            </div>
          </div>

          {/* third page */}
          <div className={page}>
            {signInOperationLoading || userLoading ? (
              <div className={`${field} ${flexContainer}`}>
                <Loader />
              </div>
            ) : signInOperationError ? (
              <>
                <div className={field}>
                  <Message error={signInOperationError} />
                </div>
                <div className={field}>
                  <Button
                    className="btnDanger btnLarge btnFullHeightWidth"
                    handleClick={() => setCurrentPage(1)}
                  >
                    Try Again
                  </Button>
                </div>
              </>
            ) : (
              <div className={field}>
                <Message success="Redirecting to your desired page..." />
              </div>
            )}
          </div>
        </form>
      </div>
      <p>
        New to zitbo? <Link to="/auth/signup">Create account</Link>
      </p>
    </div>
  );
};

export default withMultiStepAuthentication(SignIn, true);
