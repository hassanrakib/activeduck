import { useForm } from "react-hook-form";
import ProgressBar from "../ProgressBar/ProgressBar";
import {
  containerWrapper,
  logo,
  container,
  containerInner,
  containerHeader,
  formOuter,
  form,
  page,
  field,
  inputField,
  flexContainer,
  columnGap,
  btn,
  tryAgainBtn,
} from "./SignUp.module.css";
import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../Shared/Loader/Loader";
import { FaRegCheckCircle } from "react-icons/fa";
import Error from "../../Shared/Error/Error";

const Signup = () => {
  // know when the promise gets fullfilled in the onSubmit function
  const [signUpInProgress, setSignUpInProgress] = useState(true);

  // currentPage state
  const [currentPage, setCurrentPage] = useState(1);

  // set sign up error here
  const [signUpError, setSignUpError] = useState(null);

  // get auth information from AuthContext
  const { signUp, updateUserProfile, verifyEmail } = useAuth();

  // react hook form useForm() hook
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    // first blur event will do validation, later input will be revalidated on every change
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // if the input is not touched
  // input validity will not be checked by the next button click (mode: "onTouched")
  // so, check input validity
  const checkInputValidity = async (fieldName, pageNumber) => {
    // trigger function returns true if the current input is valid
    const isValid = await trigger(fieldName, { shouldFocus: true });
    if (isValid) {
      // set the current page index
      setCurrentPage(pageNumber);
    }
  };

  // set the page index to next page if the input is valid
  const handleNextBtn = (pageNumber) => {
    // check input validity before you move to the next page
    if (pageNumber === 2) {
      // check input validity by field name and if valid set page current page to next page index
      checkInputValidity("form.name", pageNumber);
    } else if (pageNumber === 3) {
      checkInputValidity("form.email", pageNumber);
    } else if (pageNumber === 4) {
      checkInputValidity("form.password", pageNumber);
    }
  };

  // no validation required to go back to previous page
  const handlePreviousBtn = (pageNumber) => setCurrentPage(pageNumber);

  // set first page marginLeft value based on current page index
  // if the currentPage = 2, after validation, then move the first page to left by -25%
  let firstPageStyle = {};
  switch (currentPage) {
    case 2:
      firstPageStyle.marginLeft = "-25%";
      break;
    case 3:
      firstPageStyle.marginLeft = "-50%";
      break;
    case 4:
      firstPageStyle.marginLeft = "-75%";
      break;
  }

  // get the submitted data
  const onSubmit = (data) => {
    // set signUpInProgress state to true
    setSignUpInProgress(true);
    // also setError to false
    setSignUpError(false);

    const form = data.form;

    // create user account (firebase)
    signUp(form.email, form.password)
      .then(() => {
        // after successful sign up update name of the user (firebase)
        updateUserProfile({ displayName: form.name });
      })
      .then(() => {
        // after successful update send verification email (firebase)
        verifyEmail();
      })
      .then(() => {
        console.log("email verification sent");
      })
      .catch((error) => {
        setSignUpError(error.message);
        console.log(error.message);
      })
      .finally(() => {
        // finally setSignUpInProgress to false as the operations are done
        setSignUpInProgress(false);
      });
  };

  return (
    <div className={`${containerWrapper} ${flexContainer}`}>
      <div className={`${container} ${flexContainer}`}>
        {/* logo goes here */}
        <div className={logo}>zitbo</div>

        <div className={containerInner}>
          <header className={containerHeader}>Sign up</header>

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
                  />
                </div>
                {errors?.form?.name && <Error message='Enter your name' />}
                <div className={field}>
                  <button
                    type="button"
                    className={btn}
                    onClick={() => {
                      handleNextBtn(2);
                    }}
                  >
                    Next
                  </button>
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
                  />
                  {errors?.form?.email && <Error message="Enter your email" />}
                </div>
                <div className={`${field} ${flexContainer} ${columnGap}`}>
                  <button
                    type="button"
                    className={btn}
                    onClick={() => {
                      handlePreviousBtn(1);
                    }}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className={btn}
                    onClick={() => handleNextBtn(3)}
                  >
                    Next
                  </button>
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
                  {errors?.form?.password && <Error message={errors.form.password.message} />}
                </div>
                <div className={`${field} ${flexContainer} ${columnGap}`}>
                  <button
                    type="button"
                    className={btn}
                    onClick={() => {
                      handlePreviousBtn(2);
                    }}
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    className={btn}
                    onClick={() => handleNextBtn(4)}
                  >
                    Submit
                  </button>
                </div>
              </div>

              {/* fourth page */}
              <div className={page}>
                {signUpInProgress ? (
                  <div className={flexContainer}>
                    <Loader />
                  </div>
                ) : signUpError ? (
                  <>
                    <div className={field}>
                      <Error message={signUpError} />
                    </div>
                    <div className={field}>
                      <button
                        type="button"
                        className={`${btn} ${tryAgainBtn}`}
                        onClick={() => {
                          handlePreviousBtn(1);
                        }}
                      >
                        Try Again
                      </button>
                    </div>
                  </>
                ) : (
                  <div className={field}>
                    <FaRegCheckCircle color="gray" size="2em" />
                    <span>Please check your email for verification!</span>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
