import initializeFirebase from "../../Firebase/firebase.init";
import AuthContext from "./AuthContext";
import { getAuth } from "firebase/auth";

// initialize Firebase
const app = initializeFirebase();

// get the auth object
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const authInformation = {};

  return (
    <AuthContext.Provider value={authInformation}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
