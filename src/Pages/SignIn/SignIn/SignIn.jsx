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
import Message from "../../Shared/Message/Message";
import Button from "../../Shared/Button/Button";
import Loader from "../../Shared/Loader/Loader";
import withMultiStepAuthentication from "../../../HOC/withMultiStepAuthentication";

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
  return (
    <div className={`${containerWrapper} ${flexContainer}`}>
        <div className={container}>
          {/* form header */}
          <header className={containerHeader}>
            <p className={logo}>zitbo</p>
            <p className={title}>Sign in</p>
          </header>
          <div className={formOuter}>
            {/* hook form handleSubmit takes care of submit event */}
            <form className={form} onSubmit={handleSubmit(onSubmit)}>
              {/* move the first page based on currentPage */}
              <div className={page} style={firstPageStyle}>
                <div className={field}>
                  <input
                    className={inputField}
                    type="email"
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
                  <Button type="button" handleClick={() => setCurrentPage(1)}>
                    Previous
                  </Button>
                  <Button
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
        </div>
      </div>
  );
};

export default withMultiStepAuthentication(SignIn, true);
