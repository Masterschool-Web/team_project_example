import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useProfile } from "../context/ProfileContext";
import { processFirebaseErrors } from "../firebase/errors";

const Profile = () => {
  const today = new Date();
  const jsonToday = today.toJSON().split("T");
  const [date] = jsonToday;
  // const [profile, setProfile] = useState({
  //   name: "",
  //   city: "amsterdam",
  //   startDate: date,
  //   endDate: null,
  //   guests: 0,
  //   gender: "",
  //   kids: false,
  //   active: false,
  // });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editor, setEditor] = useState(false);

  const {
    addProfile,
    getUserProfile,
    userProfile,
    editUserProfile,
    deleteUserProfile,
  } = useProfile();
  const { user, userLoading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(
    userProfile ?? {
      name: "",
      city: "amsterdam",
      startDate: date,
      endDate: null,
      guests: 0,
      gender: "",
      kids: false,
      active: false,
    }
  );

  // TODO: if there is profile, you cannot submit new one!

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.name) {
      return setError("Name is required");
    }

    if (!form.city) {
      return setError("City is required");
    }

    const startDate = new Date(form.startDate);
    const dateObj = new Date(date);
    const endDate = new Date(form.endDate);

    if (startDate.getTime() < dateObj.getTime()) {
      return setError("Start date should be later than today");
    }

    if (endDate.getTime() <= dateObj.getTime()) {
      return setError("End date should be later than today");
    }

    if (endDate.getTime() <= startDate.getTime()) {
      return setError("End date should be later than start date");
    }

    if (form.guests <= 0) {
      return setError("Number of guests should be greater than 0");
    }

    setError("");

    try {
      setLoading(true);

      if (!editor) {
        await addProfile({
          ...form,
          userId: user.uid,
        });
      }

      if (editor) {
        await editUserProfile({
          ...form,
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

  const deleteDocument = () => {
    deleteUserProfile(userProfile.id);
    // TODO: After deleting, how do we rerender the component
    // because we want to see empty profile form
  };

  // 1. press on "edit"
  // => change to form
  // => form is not empty
  // => form is full of the data from database
  // submit button

  // 2. press on submit
  // => update the firebase database

  if (loading || userLoading) return <div>loading...</div>;

  if (userProfile && !editor)
    return (
      <div>
        <h1>{user.email}</h1>
        <p>Name: {userProfile.name}</p>
        <p>City: {userProfile.city}</p>
        <p>
          preferred guests' gender:{" "}
          {!userProfile.gender ? "Non preferred" : userProfile.gender}
        </p>
        <p>Number of guests: {userProfile.guests}</p>
        <p>Kids allowed: {userProfile.kids ? "yes" : "no"}</p>
        <p>
          {userProfile.startDate}-{userProfile.endDate}
        </p>
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
          type='text'
          value={form.name}
          onChange={(e) => {
            setForm({
              ...form,
              name: e.target.value,
            });
          }}
        />
        <label>City</label>
        <select
          onChange={(e) =>
            setForm({
              ...form,
              city: e.target.value,
            })
          }
          value={form.city}
        >
          <option disabled>Choose...</option>
          <option default value='amsterdam'>
            Amsterdam
          </option>
          <option value='utrecht'>Utrecht</option>
          <option value='rotterdam'>Rotterdam</option>
          <option value='den haag'>Den Haag</option>
          <option value='tilburg'>Tilburg</option>
        </select>
        <label>Start Date</label>
        <input
          type='date'
          value={form.startDate}
          onChange={(e) => {
            setForm({
              ...form,
              startDate: e.target.value,
            });
          }}
        />
        <label>End Date</label>
        <input
          type='date'
          value={form.endDate}
          onChange={(e) => {
            setForm({
              ...form,
              endDate: e.target.value,
            });
          }}
        />
        <label>Gender</label>
        <select
          onChange={(e) =>
            setForm({
              ...form,
              gender: e.target.value,
            })
          }
          value={form.gender}
        >
          <option disabled>Choose...</option>
          <option default value=''>
            I Don't Care
          </option>
          <option value='female'>Female Only</option>
          <option value='male'>Male only</option>
        </select>
        <label>Guests</label>
        <input
          type='number'
          value={form.guests}
          onChange={(e) => {
            setForm({
              ...form,
              guests: e.target.value < 0 ? 0 : parseInt(e.target.value),
            });
          }}
        />
        <label>Kids</label>
        <select
          onChange={(e) =>
            setForm({
              ...form,
              kids: e.target.value,
            })
          }
          value={form.kids}
        >
          <option disabled>Choose...</option>
          <option default value={true}>
            No kids
          </option>
          <option value={false}>Kids are welcome</option>
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
