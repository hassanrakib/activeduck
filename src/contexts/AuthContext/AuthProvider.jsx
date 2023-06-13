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
import useToken from "../../hooks/useToken";

// initialize Firebase
const app = initializeFirebase();

// get the auth object
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  // set userFromFirebase after sign in, to invoke the useToken hook
  const [userFromFirebase, setUserFromFirebase] = React.useState(null);

  // useToken hook provides you the newly created token from BE
  const { token } = useToken(userFromFirebase);

  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);

  // create user account
  function signUp(email, password) {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // log in a user
  function signIn(email, password) {
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
    setLoading(true);
    return signOut(auth);
  }

  // get user from db
  function getUserFromDB(userFromFirebase, callback) {
    // when user signs out from firebase userFromFirebase becomes null
    // to sign in, user must have his userFromFirebase object's emailVerified property set to true
    // prevent unverified user to be set in the user variable
    if (userFromFirebase === null) return callback(null);

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
        fetch(`http://localhost:5000/users/${userFromFirebase.displayName}`, {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }).then((userFromDB) => callback(userFromDB));
      }
    }
  }

  // auth state change and token change calls the callback of the useEffect hook
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userFromFirebase) => {

      // send the userFromFirebase
      getUserFromDB(userFromFirebase, (userFromDB) => {
        setUser(userFromDB);
        setLoading(false);
      });
    });
    // before component gets unmounted stop the observer
    return () => unsubscribe();
  }, [token]);

  const authenticationInfo = {
    user,
    token,
    loading,
    setUserFromFirebase,
    setLoading,
    signUp,
    signIn,
    signOutUser,
    updateUserProfile,
    verifyEmail,
  };

  return (
    <AuthContext.Provider value={authenticationInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
