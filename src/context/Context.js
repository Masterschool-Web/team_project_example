import { createContext, useContext, useEffect, useState } from "react";
import { auth, createUserWithEmailAndPassword } from "../utils/firebase";

const AuthContext = createContext();

const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  // save user
  // loading
  const [user, setUser] = useState();

  // register
  const register = async ({ email, password }) => {
    console.log({ email, password });
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  // login

  // logout

  // listens to every change in login
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const exports = {
    register,
    user,
  };

  return (
    <AuthContext.Provider value={exports}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

export { useAuth };
