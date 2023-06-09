import React from "react";

const useToken = (userFromFirebase) => {
  const [token, setToken] = React.useState("");
  const [isTokenLoading, setIsTokenLoading] = React.useState(true);


  console.log("use token hook");

  React.useEffect(() => {
    if (userFromFirebase) {
      fetch(
        `http://localhost:5000/jwt?username=${userFromFirebase.displayName}`
      )
        .then((res) => res.json())
        .then(result => {
            // set to localStorage
            localStorage.setItem("token", result.token);

            // set token state
            setToken(result.token);

            console.log("inside useToken api call");
        })
        .then(() => setIsTokenLoading(false));
    }
  }, [userFromFirebase]);

  return {token, isTokenLoading};
};

export default useToken;
