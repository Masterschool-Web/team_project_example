import { createContext, useContext, useEffect, useState } from "react";
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "../firebase";

const AuthContext = createContext();

// FUNNY TRICK - NOT A MUST!
// IF NOT USED
// THEN EACH COMPONENT
// IMPORT BOTH useContext and AuthContext
const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  // state -> user inforamtion
  const [user, setUser] = useState();
  const [userLoading, setUserLoading] = useState(true);

  // signup - register
  const register = async ({ email, password }) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };
  // signin - login
  const login = async ({ email, password }) => {
    await signInWithEmailAndPassword(auth, email, password);
  };
  // signout - logout
  const logout = async () => {
    await auth.signOut();
  };

  // FIREBASE LISTENS TO ANY CHANGE IN THE USER STATUS
  // When the component loads, we want to check if user logged in
  useEffect(() => {
    // addEventListener
    // stateChange
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      setUserLoading(false);
    });

    // when component unmount -> when the component is not in use
    // return === removeEventListener
    return () => {
      unsubscribe();
    };
  }, []); // only runs once, on mount

  const exports = {
    user,
    register,
    login,
    logout,
    userLoading,
  };

  return (
    <AuthContext.Provider value={exports}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
export { useAuth };
