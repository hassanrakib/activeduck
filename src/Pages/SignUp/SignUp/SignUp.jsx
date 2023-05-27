import ProgressBar from "../ProgressBar/ProgressBar";
import {
  containerWrapper,
  container,
  logo,
  title,
  containerHeader,
  formOuter,
  form,
  page,
  field,
  inputField,
  flexContainer,
  columnGap,
} from "../../../styles/signup-signin.module.css";
import Loader from "../../Shared/Loader/Loader";
import Message from "../../Shared/Message/Message";
import Button from "../../Shared/Button/Button";
import withMultiStepAuthentication from "../../../HOC/withMultiStepAuthentication";

const SignUp = ({
  currentPage,
  handleSubmit,
  onSubmit,
  firstPageStyle,
  register,
  validateInputSetCurrentPage,
  setCurrentPage,
  errors,
  loading,
  error,
}) => {
  return (
    <div className={`${containerWrapper} ${flexContainer}`}>
        <div className={container}>
          {/* form header */}
          <header className={containerHeader}>
            <p className={logo}>zitbo</p>
            <p className={title}>Sign up</p>
          </header>

          {/* progressBar to show progress on the top */}
          <ProgressBar currentPage={currentPage} />

          <div className={formOuter}>
            {/* hook form handleSubmit takes care of submit event */}
            <form className={form} onSubmit={handleSubmit(onSubmit)}>
              {/* move the first page based on currentPage */}
              <div className={page} style={firstPageStyle}>
                <div className={field}>
                  <input
                    className={inputField}
                    type="text"
                    {...register("form.name", {
                      required: true,
                      pattern: /^[a-zA-Z\s]+$/,
                    })}
                    placeholder="John Abraham"
                    // handle enter press in input to trigger next button click
                    onKeyUp={(e) => {
                      e.key === "Enter" &&
                        validateInputSetCurrentPage(2, "form.name");
                    }}
                  />
                </div>
                {errors?.form?.name && <Message error="Enter your name" />}
                <div className={field}>
                  <Button type="button" handleClick={() => validateInputSetCurrentPage(2, "form.name")}>
                    Next
                  </Button>
                </div>
              </div>

              {/* second page */}
              <div className={page}>
                <div className={field}>
                  <input
                    className={inputField}
                    type="email"
                    {...register("form.email", {
                      required: true,
                      pattern:
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    })}
                    placeholder="john@zitbo.com"
                    onKeyUp={(e) => e.key === "Enter" && validateInputSetCurrentPage(3, "form.email")}
                  />
                </div>
                {errors?.form?.email && <Message error="Enter your email" />}
                <div className={`${field} ${flexContainer} ${columnGap}`}>
                  <Button
                    type="button"
                    handleClick={() => setCurrentPage(1)}
                  >
                    Previous
                  </Button>
                  <Button type="button" handleClick={() => validateInputSetCurrentPage(3, "form.email")}>
                    Next
                  </Button>
                </div>
              </div>

              {/* third page */}
              <div className={page}>
                <div className={field}>
                  <input
                    className={inputField}
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
                    placeholder="$ecretpassw@rd"
                  />
                </div>
                {errors?.form?.password && (
                  <Message error={errors.form.password.message} />
                )}
                <div className={`${field} ${flexContainer} ${columnGap}`}>
                  <Button
                    type="button"
                    handleClick={() => setCurrentPage(2)}
                  >
                    Previous
                  </Button>
                  <Button
                    // stop submitting form by clicking enter from page other than three no. page
                    // last button click done by submit, so, watch onSubmit
                    type={currentPage === 3 ? "submit" : "button"}
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
                        type="button"
                        className="btnDanger"
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
        </div>
      </div>
  );
};

export default withMultiStepAuthentication(SignUp);
