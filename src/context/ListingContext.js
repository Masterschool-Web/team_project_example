import { deleteDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import {
  db,
  addDoc,
  collection,
  serverTimestamp,
  setDoc,
  query,
  where,
  getDocs,
  doc,
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
      const data = doc.data();
      setUserProfile({ ...data, id: doc.id });
    });
  };

  // UPDATE/PUT (SET)
  const editUserProfile = async (profile) => {
    if (!profile.id) {
      throw new Error("Profile needs an id");
    }

    const docRef = doc(db, "profiles", profile.id);
    await setDoc(docRef, {
      ...profile,
      updatedAt: serverTimestamp(),
    });
  };

  // DELETE
  const deleteUserProfile = async (profileId) => {
    const docRef = doc(db, "profiles", profileId);
    await deleteDoc(docRef);
  };

  const exports = {
    addProfile,
    getUserProfile,
    userProfile,
    editUserProfile,
    deleteUserProfile,
  };

  return (
    <ProfileContext.Provider value={exports}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileProvider;
export { useProfile };
