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

// initialize Firebase
const app = initializeFirebase();

// get the auth object
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [authenticationInfo, setAuthenticationInfo] = useState({
    signUp,
    logIn,
    logOut,
    updateUserProfile,
    verifyEmail,
    user: null,
  });

  // create user account
  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // log in a user
  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // update a uesr profile
  function updateUserProfile(updatePropertyObj) {
    return updateProfile(auth.currentUser, updatePropertyObj);
  }

  // send verification email
  function verifyEmail() {
    return sendEmailVerification(auth.currentUser);
  }

  // log out a user
  function logOut() {
    return signOut(auth);
  }

  // get the currently signed in user
  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticationInfo({ ...authenticationInfo, user });
      } else {
        setAuthenticationInfo({ ...authenticationInfo, user: null });
      }
    });
  }, [authenticationInfo]);

  return (
    <AuthContext.Provider value={authenticationInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
