import ProgressBar from "../ProgressBar/ProgressBar";
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
import Loader from "../../Shared/Loader/Loader";
import Message from "../../Shared/Message/Message";
import Button from "../../Shared/Button/Button";
import withMultiStepAuthentication from "../../../HOC/withMultiStepAuthentication";
import { Link } from "react-router-dom";

const SignUp = ({
  currentPage,
  handleSubmit,
  onSubmit,
  onError,
  firstPageStyle,
  register,
  validateInputSetCurrentPage,
  setCurrentPage,
  errors,
  loading,
  error,
}) => {
  // used in validate object of form.username field's register api
  // check if username is unique and if not return a message from here
  const checkIfUsernameUnique = async (usernameToCheck) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_LOCAL_HOST}/users/validate/${usernameToCheck}`
      );
      const { username } = await response.json();

      if (!username) return true;

      // if username exists
      return "Username is taken";
    } catch (err) {
      return "Server error!";
    }
  };

  return (
    <div className={formContainer}>
      {/* form title */}
      <h1 className={formTitle}>Sign up</h1>

      {/* progressBar to show progress on the top */}
      <ProgressBar currentPage={currentPage} />

      <div className={formOuter}>
        {/* hook form handleSubmit takes care of submit event */}
        <form className={form} onSubmit={handleSubmit(onSubmit, onError)}>
          {/* move the first page based on currentPage */}
          <div className={page} style={firstPageStyle}>
            <div className={field}>
              <input
                className={inputStyles.input}
                type="text"
                {...register("form.username", {
                  required: "Username is required",
                  minLength: {
                    value: 4,
                    message: "Username must be four characters long",
                  },
                  validate: {
                    mustStartWithLetters: (username) =>
                      /^[a-z]/.test(username) ||
                      "Username must start with letters",
                    allowedCharacters: (username) =>
                      /^[a-z0-9_]+$/.test(username) ||
                      "Username can contain lowercase letters, numbers and underscores",
                    usernameUniqueness: checkIfUsernameUnique,
                  },
                })}
                placeholder="Username"
                // handle enter press in input to trigger next button click
                onKeyUp={(e) => {
                  e.key === "Enter" &&
                    validateInputSetCurrentPage(2, "form.username");
                }}
              />
            </div>
            {errors?.form?.username && (
              <Message error={errors.form.username.message} />
            )}
            <div className={field}>
              <Button
                handleClick={() =>
                  validateInputSetCurrentPage(2, "form.username")
                }
                className="btnFullHeightWidth btnLarge btnBlueviolet"
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
                type="email"
                {...register("form.email", {
                  required: true,
                  pattern:
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                })}
                placeholder="Email"
                onKeyUp={(e) =>
                  e.key === "Enter" &&
                  validateInputSetCurrentPage(3, "form.email")
                }
              />
            </div>
            {errors?.form?.email && <Message error="Enter your email" />}
            <div className={`${field} ${flexContainer} ${columnGap}`}>
              <Button
                handleClick={() => setCurrentPage(1)}
                className="btnFullHeightWidth btnLarge btnBlueviolet"
              >
                Previous
              </Button>
              <Button
                handleClick={() => validateInputSetCurrentPage(3, "form.email")}
                className="btnFullHeightWidth btnLarge btnBlueviolet"
              >
                Next
              </Button>
            </div>
          </div>

          {/* third page */}
          <div className={page}>
            <div className={field}>
              <input
                className={inputStyles.input}
                type="password"
                {...register("form.password", {
                  required: "Enter your password",
                  minLength: {
                    value: 8,
                    message: "Password must be 8 characters long",
                  },
                  validate: {
                    lowercaseLetter: (password) =>
                      /[a-z]/.test(password) ||
                      "Password must contain a lowercase letter",
                    uppercaseLetter: (password) =>
                      /[A-Z]/.test(password) ||
                      "Password must contain an uppercase letter",
                    digit: (password) =>
                      /\d/.test(password) ||
                      "Password must contain at least one digit",
                    specialCharacter: (password) =>
                      /[?!@#$%^&*()]/.test(password) ||
                      "Password must contain a special character.",
                  },
                })}
                placeholder="Password"
              />
            </div>
            {errors?.form?.password && (
              <Message error={errors.form.password.message} />
            )}
            <div className={`${field} ${flexContainer} ${columnGap}`}>
              <Button
                handleClick={() => setCurrentPage(2)}
                className="btnFullHeightWidth btnLarge btnBlueviolet"
              >
                Previous
              </Button>
              <Button
                // stop submitting form by clicking enter from page other than three no. page
                // last button click done by submit, so, watch onSubmit
                type={currentPage === 3 ? "submit" : "button"}
                className="btnFullHeightWidth btnLarge btnBlueviolet"
              >
                Submit
              </Button>
            </div>
          </div>

          {/* fourth page */}
          <div className={page}>
            {loading ? (
              <div className={`${field} ${flexContainer}`}>
                <Loader />
              </div>
            ) : error ? (
              <>
                <div className={field}>
                  <Message error={error} />
                </div>
                <div className={field}>
                  <Button
                    className="btnFullHeightWidth btnDanger btnLarge"
                    handleClick={() => setCurrentPage(1)}
                  >
                    Try Again
                  </Button>
                </div>
              </>
            ) : (
              <div className={field}>
                <Message success="Please verify your email" />
              </div>
            )}
          </div>
        </form>
      </div>
      <p>
        Already have an account? <Link to="/auth/signin">Sign in</Link>
      </p>
    </div>
  );
};

export default withMultiStepAuthentication(SignUp);
