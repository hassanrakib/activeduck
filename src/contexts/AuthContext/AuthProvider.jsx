import React, { useState } from "react";
import initializeFirebase from "../../Firebase/firebase.init";
import AuthContext from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { socket } from "../../socket";

// initialize Firebase
const app = initializeFirebase();

// get the auth object
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  // auth token that we recieve after successfull login
  const [token, setToken] = useState("");

  // know that user is loading or not
  // first time when a visitor comes onAuthStateChanged observer will try to get the user
  // that is why user loading by default set to true
  // and finally after completing onAuthStateChanged doing its operations, set loading to false
  const [loading, setLoading] = useState(true);

  // user of the application
  const [user, setUser] = useState(null);

  // create user account
  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // log in a user
  function signIn(email, password) {
    // sign in makes the user loading set to true
    // after doing operations, onAuthStateChanged will set loading to false
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  }

  // update a user profile
  function updateUserProfile(updatePropertyObj) {
    return updateProfile(auth.currentUser, updatePropertyObj);
  }

  // send verification email
  function verifyEmail() {
    return sendEmailVerification(auth.currentUser);
  }

  // log out a user
  function signOutUser() {
    // sign out makes the user loading set to true
    // after doing operations, onAuthStateChanged will set loading to false
    setLoading(true);
    // remove the existing token from the localStorage
    localStorage.removeItem("token");
    // disconnect the socket
    socket.disconnect();
    return signOut(auth);
  }

  // get user from db
  // it recieves the user from firebase
  async function getUserFromDB(userFromFirebase) {
    // when user signs out from firebase userFromFirebase becomes null
    // to sign in, user must have his userFromFirebase object's emailVerified property set to true
    // prevent unverified user to be set in the user variable
    if (userFromFirebase === null) return null;

    // if userFromFirebase object's emailVerified property is true
    if (userFromFirebase.emailVerified) {
      // get access token from local storage to fetch user from db
      // without access token user will not be given from server side
      const accessToken = localStorage.getItem("token");

      // token existence check is needed
      // because when we sign in, observer is called also useToken hook is called
      // before the token gets ready by useToken hook, we have our userFromFirebase sent to this function
      if (accessToken) {
        // get user from db by sending username
        // that was previously set to displayName property of the firebase user
        const response = await fetch(
          `${import.meta.env.VITE_LOCAL_HOST}/users/${
            userFromFirebase.displayName
          }`,
          {
            headers: {
              // send the token to pass verifyJWT middleware
              authorization: `Bearer ${accessToken}`,
            },
          }
        );
        // get the result from response object
        const result = await response.json();

        // if successfully got the user, return a resolved promise with the user
        if (result.username) {
          return result;
        } else {
          // if not successful in getting the user, return a rejected promise
          // user getting will fail, if the token is expired or compromised
          await Promise.reject(result);
        }
      }
    }
  }

  // auth state change and token change calls the callback of the useEffect hook
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userFromFirebase) => {
      getUserFromDB(userFromFirebase)
        .then((userFromDB) => {
          // when user logs out we get userFromDB as null
          setUser(userFromDB);
        })
        .catch((err) => {
          // if the token is expired or compromised
          console.log(err.message);
        })
        .finally(() => {
          // set user loading to false
          setLoading(false);
        });
    });

    // before component gets unmounted stop the observer
    return () => unsubscribe();
  }, [token]);

  const authenticationInfo = {
    user,
    loading,
    setToken,
    setLoading,
    signUp,
    signIn,
    signOutUser,
    updateUserProfile,
    verifyEmail,
  };

  return (
    // children inside the AuthContext.Provider component are consumers of the AuthContext
    <AuthContext.Provider value={authenticationInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
