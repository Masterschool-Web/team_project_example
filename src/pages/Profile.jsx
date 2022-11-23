import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useProfile } from "../context/ProfileContext";
import { processFirebaseErrors } from "../firebase/errors";

const Profile = () => {
  const today = new Date();
  const jsonToday = today.toJSON().split("T");
  const [date] = jsonToday;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editor, setEditor] = useState(false);

  const {
    addProfile,
    getUserProfile,
    userProfile,
    editUserProfile,
    deleteUserProfile,
    clearProfile,
  } = useProfile();
  const { user, userLoading } = useAuth();
  const navigate = useNavigate();

  const emptyForm = {
    name: "",
    age: "",
    about: "",
    gender: "",
  };

  const [form, setForm] = useState(userProfile ?? emptyForm);

  const onSubmit = async (e) => {
    e.preventDefault();

    console.log("sbubmitting");

    if (form.about.length > 300) {
      return setError("About me section must be less than 300");
    }

    const age = parseInt(form.age);

    setError("");

    try {
      setLoading(true);

      if (!editor) {
        await addProfile({
          ...form,
          age,
          userId: user.uid,
        });
      }

      if (editor) {
        await editUserProfile({
          ...form,
          age,
          userId: user.uid,
        });
      }

      // snapshot === "event listener"
      await getUserProfile(user.uid);
      setEditor(false);
      setLoading(false);
      setError("");
    } catch (err) {
      //   setLoading(false);
      console.log(err);
      setError(processFirebaseErrors(err.message));
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) getUserProfile(user.uid);
  }, [user, getUserProfile]);

  useEffect(() => {
    if (!user & !userLoading) {
      navigate("/login");
    }
  }, [user, userLoading, navigate]);

  // const setFormWithProfile = async () => {
  // await getUserProfile(user.uid);
  // setForm(userProfile);
  // }

  const openEditor = () => {
    setEditor(true);
    setForm(userProfile);
  };

  const deleteDocument = async () => {
    try {
      setLoading(true);
      await deleteUserProfile(userProfile.id);
      clearProfile();
      setError("");
      // setForm(emptyForm);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading || userLoading) return <div>loading...</div>;

  if (userProfile && !editor)
    return (
      <div>
        <Link to='/'>Back</Link>
        <h1>{user.name}</h1>
        <p>Age: {userProfile.age}</p>
        <p>About: {userProfile.about}</p>
        <p>Gender: {userProfile.gender}</p>
        <button onClick={openEditor}>Edit</button>
        <button onClick={deleteDocument}>Delete</button>
      </div>
    );

  return (
    <>
      <Link to='/'>Back</Link>
      <form
        onSubmit={onSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "400px",
          gap: "12px",
        }}
      >
        <h1>Profile</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <label>Name</label>
        <input
          required
          type='text'
          value={form.name}
          onChange={(e) => {
            setForm({
              ...form,
              name: e.target.value,
            });
          }}
        />
        <label>Age</label>
        <input
          required
          type='number'
          value={form.age}
          onChange={(e) => {
            setForm({
              ...form,
              age: e.target.value,
            });
          }}
        />
        <label>About Me</label>
        <textarea
          required
          value={form.about}
          onChange={(e) => {
            setForm({
              ...form,
              about: e.target.value,
            });
          }}
        />
        <label>Gender</label>
        <select
          required
          onChange={(e) =>
            setForm({
              ...form,
              gender: e.target.value,
            })
          }
          value={form.gender}
        >
          <option disabled>Choose...</option>
          <option value='female'>Female</option>
          <option value='male'>Male</option>
          <option value='other'>Other</option>
        </select>
        {!editor ? (
          <input type='submit' value='SUBMIT' />
        ) : (
          <input type='submit' value='EDIT' />
        )}
      </form>
    </>
  );
};

export default Profile;
