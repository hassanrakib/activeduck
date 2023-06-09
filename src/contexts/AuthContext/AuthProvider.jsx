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
  // set the user that comes from firebase to invoke useToken hook
  // setUserFromFirebase is sent to the sign in component
  // where userFromFirebase is set
  const [userFromFirebase, setUserFromFirebase] = React.useState(null);

  // useToken hook provides you the token from BE
  const {token, isTokenLoading} = useToken(userFromFirebase);

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
    console.log("getUserFromDB");
    // when user signs out from firebase userFromFirebase becomes null
    // to sign in, user must have his userFromFirebase objects emailVerified property set to true
    // prevent unverified user to be set in the user variable
    if (userFromFirebase === null) return callback(null);

    if (userFromFirebase.emailVerified) {
      // get user from db by sending username
      // that was previously set to displayName property of the firebase user
      fetch(`http://localhost:5000/users/${userFromFirebase.displayName}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      }).then(
        (userFromDB) => callback(userFromDB)
      );
    }
  }

  // onAuthStateChanged observes the change of auth
  React.useEffect(() => {
    console.log("Inside observer", isTokenLoading);
    const unsubscribe = onAuthStateChanged(auth, (userFromFirebase) => {
      // send the userFromFirebase
      getUserFromDB(userFromFirebase, (userFromDB) => {
        console.log("set user");
        setUser(userFromDB);
        setLoading(false);
      });
    });
    // before component gets unmounted stop the observer
    return () => unsubscribe();
  }, [isTokenLoading]);

  const authenticationInfo = {
    user,
    setUserFromFirebase,
    token,
    loading,
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
