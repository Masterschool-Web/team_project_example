import { createContext, useContext, useEffect, useState } from "react";
import {
  db,
  addDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc,
  query,
  where,
  getDocs,
} from "../firebase";

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

  const [userProfile, setUserProfile] = useState();

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

  // GET USER PROFILE
  const getUserProfile = async (userId) => {
    if (typeof userId !== "string") {
      throw new Error("user id must be a string");
    }

    const colRef = collection(db, "profiles");
    const q = query(colRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setUserProfile(doc.data());
    });
  };

  // UPDATE/PUT (SET)

  // DELETE

  const exports = {
    addProfile,
    getUserProfile,
    userProfile,
  };

  return (
    <ProfileContext.Provider value={exports}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileProvider;
export { useProfile };
