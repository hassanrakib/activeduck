import React from "react";

const useToken = (userFromFirebase) => {
  const [currentToken, setCurrentToken] = React.useState("");

  React.useEffect(() => {
    // useToken is invoked by the userFromFirebase state change in AuthProvider
    // if userFromFirebase has it's emailVerified to true
    // then we setUserFromFirebase(userFromFirebase) in sign in handler 
    
    // at first userFromFirebase is null
    // so check is needed
    if (userFromFirebase) {
      fetch(
        `http://localhost:5000/jwt?username=${userFromFirebase.displayName}`
      )
        .then((res) => res.json())
        .then(result => {
            // set to localStorage
            localStorage.setItem("token", result.token);

            // set token state
            setCurrentToken(result.token);
        });
    }
  }, [userFromFirebase]);

  // provides the latest token
  return {currentToken};
};

export default useToken;
