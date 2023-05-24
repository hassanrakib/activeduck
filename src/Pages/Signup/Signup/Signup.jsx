import { useForm } from "react-hook-form";
import { IoMdAlert } from "react-icons/io";
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
  error,
  errorIcon,
  errorMessage,
  btn,
  prev,
} from "./Signup.module.css";
import { useState } from "react";

const Signup = () => {
  // currentPage state
  const [currentPage, setCurrentPage] = useState(1);

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
    const isValid = await trigger(fieldName, {shouldFocus: true});
    if (isValid) {
      setCurrentPage(pageNumber);
    }
  };

  // set the page index to next page if the input is valid
  const handleNextBtn = (pageNumber) => {
    // check input validity before you move to the next page
    if (pageNumber === 2) {
      checkInputValidity("form.name", pageNumber);
    } else if (pageNumber === 3) {
      checkInputValidity("form.email", pageNumber);
    } else if (pageNumber === 4) {
      checkInputValidity("form.password", pageNumber);
    }
  };

  const handlePreviousBtn = (pageNumber) => setCurrentPage(pageNumber);

  // get the submitted data
  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className={containerWrapper}>
      <div className={container}>
        {/* logo goes here */}
          <div className={logo}>zitbo</div>

        <div className={containerInner}>
          <header className={containerHeader}>Sign up</header>

          {/* progressBar to show progress on the top */}
          <ProgressBar currentPage={currentPage} />

          <div className={formOuter}>
            <form className={form} onSubmit={handleSubmit(onSubmit)}>
              {/* move the first page based on currentPage */}
              <div
                className={page}
                style={
                  currentPage === 2
                    ? { marginLeft: "-33.33%" }
                    : currentPage === 3
                    ? { marginLeft: "-66.66%" }
                    : null
                }
              >
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
                  {errors?.form?.name && (
                    <div className={error}>
                      <IoMdAlert className={errorIcon} />
                      <span className={errorMessage}>Enter your name</span>
                    </div>
                  )}
                </div>
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
                  {errors?.form?.email && (
                    <div className={error}>
                      <IoMdAlert className={errorIcon} />
                      <span className={errorMessage}>Enter your email</span>
                    </div>
                  )}
                </div>
                <div className={field}>
                  <button
                    type="button"
                    className={`${btn} ${prev}`}
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
                  {errors?.form?.password && (
                    <div className={error}>
                      <IoMdAlert className={errorIcon} />
                      <span className={errorMessage}>
                        {errors.form.password.message}
                      </span>
                    </div>
                  )}
                </div>
                <div className={field}>
                  <button
                    type="button"
                    className={`${btn} ${prev}`}
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
