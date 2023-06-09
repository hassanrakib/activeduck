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
import {inputField} from "../../../styles/global.module.css";
import Message from "../../Shared/Message/Message";
import Button from "../../Shared/Button/Button";
import Loader from "../../Shared/Loader/Loader";
import withMultiStepAuthentication from "../../../HOC/withMultiStepAuthentication";
import { Link, Navigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

const SignIn = ({
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
  const {token} = useAuth();
  if(token) return <Navigate to="/" replace={true} />
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
                  className={inputField}
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
                className="btnHeightWidth100"
                  type="button"
                  handleClick={() =>
                    validateInputSetCurrentPage(2, "form.email")
                  }
                >
                  Next
                </Button>
              </div>
            </div>

            {/* second page */}
            <div className={page}>
              <div className={field}>
                <input
                  className={inputField}
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
                <Button type="button" className="btnHeightWidth100" handleClick={() => setCurrentPage(1)}>
                  Previous
                </Button>
                <Button
                className="btnHeightWidth100"
                  // stop submitting form by clicking enter from page other than page index two
                  // last button click done by submit, so, watch onSubmit

                  type={currentPage === 2 ? "submit" : "button"}
                >
                  Sigin
                </Button>
              </div>
            </div>

            {/* third page */}
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
                  <Message success="Redirecting to your desired page..." />
                </div>
              )}
            </div>
          </form>
        </div>
        <p>New to zitbo? <Link to="/auth/signup">Create account</Link></p>
      </div>
  );
};

export default withMultiStepAuthentication(SignIn, true);
