import React from "react";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import useToken from "../hooks/useToken";
const withMultiStepAuthentication = (Form, isSignIn) => {
  return function AuthenticationForm() {
    // after successful sign in set user from firebase
    const [userFromFirebase, setUserFromFirebase] = React.useState(null);

    // useToken hook provides you the newly created token from BE
    const { currentToken } = useToken(userFromFirebase);

    // know when the promise gets fullfilled in the onSubmit function
    const [loading, setLoading] = React.useState(false);

    // currentPage state
    const [currentPage, setCurrentPage] = React.useState(1);

    // set authentication operation error here
    const [error, setError] = React.useState("");

    // get auth information from AuthContext
    const {
      signIn,
      signUp,
      signOutUser,
      updateUserProfile,
      verifyEmail,
      setLoading: setUserLoading,
    } = useAuth();

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
      // {shouldFocus: true} focus the input during setting an error
      const isValid = await trigger(fieldName, { shouldFocus: true });
      // if the input is valid
      if (isValid) {
        // set the currentPage state to nextPageIndex
        setCurrentPage(nextPageIndex);
      }
      // finally return a resolved promise with isValid data
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

    // [caution: sign up related]
    // submit event again does revalidation of all the fields
    // in SignUp component, error can happen when the client fails to communicate with server
    // specifically in username validation
    // and if error happens react hook form doesn't call onSubmit function
    // instead call onError function
    const onError = () => {
      // set error
      setError("Unable to complete the operation!");

      // go to next page where we show error
      setCurrentPage(4);
    };

    // [caution: sign  up related]
    // save new user to db
    const saveUserToDB = async (newUser) => {
      const response = await fetch(`${import.meta.env.VITE_LOCAL_HOST}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      const result = await response.json();

      // if failed to save, return a rejected promise
      if (!result.acknowledged) await Promise.reject({message: "User creation failed"});
    };

    // [caution: sign up related]
    // get the submitted data
    const handleSignUp = (data) => {
      // check validity of the last input set current page index to the last page
      // send next page index to move to the next page and field name to validate
      validateInputSetCurrentPage(4, "form.password").then((isValid) => {
        // if the last input is not valid then return from here to quit the signup operation
        if (!isValid) return;
      });

      // set loading state to true
      setLoading(true);
      // also setError to empty
      setError("");

      const form = data.form;

      // create user account (firebase)
      signUp(form.email, form.password)
        // after successful user creation in firebase => save user to db
        .then(() => {
          saveUserToDB({
            username: form.username,
          });
        })
        .then(() => {
          // after successful sign up update name of the user (firebase)
          updateUserProfile({ displayName: form.username });
        })
        .then(() => {
          // after successful update send verification email (firebase)
          verifyEmail();
        })
        .then(() => {
          console.log("email verification sent");
          // sign out the user to prevent unverified user to automatically be signed in to firebase
          // also if not signed out, the next sign in will not call the observer in AuthProvider
          signOutUser();
        })
        .catch((error) => {
          // if any of the operation fails
          setError(error.message);
        })
        .finally(() => {
          // finally setLoading to false as the operations are done
          setLoading(false);
        });
    };

    // handle sign in
    const handleSignIn = (data) => {
      // check validity of the last input set current page index to the last page
      validateInputSetCurrentPage(3, "form.password").then((isValid) => {
        // if the last input is not valid then return from here to quit the singin operation
        if (!isValid) return;
      });

      // set loading state to true
      setLoading(true);
      // also setError to empty
      setError("");

      const form = data.form;

      // sign in user (firebase)
      signIn(form.email, form.password)
        .then((userCredential) => {
          // getting into then block means the user is successful in signing in
          const userFromFirebase = userCredential.user;

          if (userFromFirebase.emailVerified) {
            // get token from server so that we can use it for authorization to get data from server
            // after we setUserFromFirebase, state change triggers the useToken hook
            setUserFromFirebase(userFromFirebase);
          } else {
            // when the user changes
            // onAuthStateChanged is hit
            // but unverified user is not allowed to be set to the user variable (AuthProvider)
            // so, we don't see the user in the frontend although the user is signed in to firebase
            // and another sign in of the same user (as user can't see his signing in being successful)
            // doesn't change user, so no hit to onAuthStateChanged
            // because of no hit to onAuthStateChanged (that contains setLoading(false) statement)
            // setLoading(true) in signIn() is going to persist loading to be true indefinitely

            // to avoid the above problem
            signOutUser();

            // and set error
            setError("Please verify your email and sign in");
          }
        })
        .catch((error) => {
          // if fails to sign in to firebase
          setError(error.message);

          // because of error in sign in operation => onAuthStateChanged will not be called
          // so, we need to set user loading to false
          setUserLoading(false);
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
        onError={onError}
        firstPageStyle={firstPageStyle}
        register={register}
        errors={errors}
        validateInputSetCurrentPage={validateInputSetCurrentPage}
        setCurrentPage={setCurrentPage}
        loading={loading}
        error={error}
        token={currentToken}
      />
    );
  };
};

export default withMultiStepAuthentication;
