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
} from "./SignUp.module.css";
import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../Shared/Loader/Loader";
import Message from "../../Shared/Message/Message";
import Button from "../../Shared/Button/Button";

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
  const checkInputValidityAndSetCurrentPage = async (fieldName, pageNumber) => {
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
      // check input validity by field name and if valid set current page to next page index
      checkInputValidityAndSetCurrentPage("form.name", pageNumber);
    } else if (pageNumber === 3) {
      checkInputValidityAndSetCurrentPage("form.email", pageNumber);
    } else if (pageNumber === 4) {
      checkInputValidityAndSetCurrentPage("form.password", pageNumber);
    }
  };
  // handle enter press in input to trigger next button click
  const handleOnKeyUp = (e, pageNumber) => {
    if (e.key === "Enter") handleNextBtn(pageNumber);
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
    console.log(form);

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
                    onKeyUp={(e) => handleOnKeyUp(e, 2)}
                  />
                </div>
                {errors?.form?.name && <Message error="Enter your name" />}
                <div className={field}>
                  <Button type="button" onClick={handleNextBtn} onClickArg={2}>
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
                    onKeyUp={(e) => handleOnKeyUp(e, 3)}
                  />
                </div>
                {errors?.form?.email && <Message error="Enter your email" />}
                <div className={`${field} ${flexContainer} ${columnGap}`}>
                  <Button
                    type="button"
                    onClick={handlePreviousBtn}
                    onClickArg={1}
                  >
                    Previous
                  </Button>
                  <Button type="button" onClick={handleNextBtn} onClickArg={3}>
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
                    onKeyUp={(e) => handleOnKeyUp(e, 4)}
                  />
                </div>
                {errors?.form?.password && (
                  <Message error={errors.form.password.message} />
                )}
                <div className={`${field} ${flexContainer} ${columnGap}`}>
                  <Button
                    type="button"
                    onClick={handlePreviousBtn}
                    onClickArg={2}
                  >
                    Previous
                  </Button>
                  <Button
                    // stop submitting form by clicking enter from page other than three no. page
                    // click event will validate the form field first then
                    // change button type to submit and submit the form
                    type={currentPage === 3 ? "submit" : "button"}
                    onClick={handleNextBtn}
                    onClickArg={4}
                  >
                    Submit
                  </Button>
                </div>
              </div>

              {/* fourth page */}
              <div className={page}>
                {signUpInProgress ? (
                  <div className={`${field} ${flexContainer}`}>
                    <Loader />
                  </div>
                ) : signUpError ? (
                  <>
                    <div className={field}>
                      <Message error={signUpError} />
                    </div>
                    <div className={field}>
                      <Button
                        type="button"
                        className="btnDanger"
                        onClick={handlePreviousBtn}
                        onClickArg={1}
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
    </div>
  );
};

export default Signup;
