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
  const [user, setUser] = useState(null);

  // create user account
  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // log in a user
  function signIn(email, password) {
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
  function signOutUser() {
    return signOut(auth);
  }

  // get the currently signed in user
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        
      } else {
        setUser(null);
      }
    });
    // when component gets unmounted stop the observer
    return () => unsubscribe();
  }, []);

  const authenticationInfo = {user, signUp, signIn, signOut, updateUserProfile, verifyEmail}

  return (
    <AuthContext.Provider value={authenticationInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
