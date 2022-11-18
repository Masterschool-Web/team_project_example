import { createContext, useContext, useEffect, useState } from "react";
import { db, addDoc, collection, serverTimestamp } from "../firebase";

const ProfileContext = createContext();

const useProfile = () => {
  return useContext(ProfileContext);
};

const ProfileProvider = ({ children }) => {
  // CRUD - REST_API
  // BACKEND === API
  // FRONTEND (REACT) => BACKEND (FIREBAE API) => DB
  // C- CREATE (POST)
  // R- READ (GET)
  // U- UPDATE
  // D- DELETE

  // POST (ADD)
  const addProfile = async (profile) => {
    if (!profile.userId) {
      throw new Error("User id is mandatory");
    }

    // --> firebase --> add...
    await addDoc(collection(db, "profiles"), {
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  // GET

  // UPDATE/PUT (SET)

  // DELETE

  const exports = {
    addProfile,
  };

  return (
    <ProfileContext.Provider value={exports}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileProvider;
export { useProfile };
