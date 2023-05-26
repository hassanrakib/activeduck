import React from "react";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
const withMultiStepAuthentication = (Form, isSignIn) => {
  return function AuthenticationForm() {
    // know when the promise gets fullfilled in the onSubmit function
    const [loading, setLoading] = React.useState(false);

    // currentPage state
    const [currentPage, setCurrentPage] = React.useState(1);

    // set authentication operation error here
    const [error, setError] = React.useState(null);

    // get auth information from AuthContext
    const { signIn, signUp, signOutUser, updateUserProfile, verifyEmail } = useAuth();

    // react hook form useForm() hook
    const {
      register,
      handleSubmit,
      trigger,
      formState: { errors },
    } = useForm({
      // first blur event will do validation, later input will be revalidated on every change
      mode: "onTouched",
    });

    // if the input is not touched
    // input validity will not be checked by the next button click / enter press (mode: "onTouched")
    // so, check input validity before going to next page
    const validateInputSetCurrentPage = async (nextPageIndex, fieldName) => {
      // trigger function returns true if the current input field is valid
      const isValid = await trigger(fieldName, { shouldFocus: true });
      if (isValid) {
        // set the page index to next page if the input is valid
        setCurrentPage(nextPageIndex);
      }
      return isValid;
    };

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
    const handleSignUp = (data) => {
      // check validity of the last input set current page index to the last page
      validateInputSetCurrentPage(4, "form.password").then(
        (isValid) => {
          // if the last input is not valid then return from here
          if (!isValid) return;
        }
      );

      // set loading state to true
      setLoading(true);
      // also setError to false
      setError(false);

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
          // and sign out the user to prevent unverified user to automatically be signed in
          signOutUser();
        })
        .catch((error) => {
          setError(error.message);
          console.log(error.message);
        })
        .finally(() => {
          // finally setLoading to false as the operations are done
          setLoading(false);
        });
    };

    const handleSignIn = (data) => {
      // check validity of the last input set current page index to the last page
      validateInputSetCurrentPage(3, "form.password").then(
        (isValid) => {
          // if the last input is not valid then return from here
          if (!isValid) return;
        }
      );

      // set loading state to true
      setLoading(true);
      // also setError to false
      setError(false);

      const form = data.form;
      console.log(form);

      // create user account (firebase)
      signIn(form.email, form.password)
        .then((userCredential) => {
          console.log(userCredential.user);
        })
        .catch((error) => {
          setError(error.message);
          console.log(error.message);
        })
        .finally(() => {
          // finally setLoading to false as the operations are done
          setLoading(false);
        });
    };

    return (
      <Form
        currentPage={currentPage}
        handleSubmit={handleSubmit}
        onSubmit={isSignIn ? handleSignIn : handleSignUp}
        firstPageStyle={firstPageStyle}
        register={register}
        errors={errors}
        validateInputSetCurrentPage={validateInputSetCurrentPage}
        setCurrentPage={setCurrentPage}
        loading={loading}
        error={error}
      />
    );
  };
};

export default withMultiStepAuthentication;
