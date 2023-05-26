
const withMultiStepAuthentication = (AuthenticationForm) => {
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

  return <AuthenticationForm />;

};

export default withMultiStepAuthentication
