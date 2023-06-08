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
  const [loading, setLoading] = useState(true);

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

  // onAuthStateChanged observes the change of auth
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // when user signed out user is null
      // when user signed in user must have his emailVerified to true
      // prevent unverified user to be set in the user variable

      if (user === null) {
        setUser(null);
      } else if (user.emailVerified) {
        // if the user successfully signs in with verified email
        
      }
      setLoading(false);
    });
    // before component gets unmounted stop the observer
    return () => unsubscribe();
  }, []);

  const authenticationInfo = {
    user,
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
