import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useProfile } from "../context/ProfileContext";
import { processFirebaseErrors } from "../firebase/errors";

const Profile = () => {
  const today = new Date();
  const jsonToday = today.toJSON().split("T");
  const [date] = jsonToday;
  const [profile, setProfile] = useState({
    name: "",
    city: "amsterdam",
    startDate: date,
    endDate: null,
    guests: 0,
    gender: "",
    kids: false,
    active: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { addProfile } = useProfile();
  const { user, userLoading } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!profile.name) {
      return setError("Name is required");
    }

    if (!profile.city) {
      return setError("City is required");
    }

    const startDate = new Date(profile.startDate);
    const dateObj = new Date(date);
    const endDate = new Date(profile.endDate);

    if (startDate.getTime() < dateObj.getTime()) {
      return setError("Start date should be later than today");
    }

    if (endDate.getTime() <= dateObj.getTime()) {
      return setError("End date should be later than today");
    }

    if (endDate.getTime() <= startDate.getTime()) {
      return setError("End date should be later than start date");
    }

    if (profile.guests <= 0) {
      return setError("Number of guests should be greater than 0");
    }

    setError("");

    try {
      //   setLoading(true);
      //   // go to db
      await addProfile(profile);
      //   setLoading(false);

      //   // navigate to a different page
      //   navigate("/");
    } catch (err) {
      //   setLoading(false);
      //   console.log(err);
      //   setError(processFirebaseErrors(err.message));
    }
  };

  useEffect(() => {
    if (!user & !userLoading) {
      navigate("/login");
    }
  }, [user, userLoading, navigate]);

  if (loading || userLoading) return <div>loading...</div>;

  return (
    <>
      <Link to='/'>Back</Link>
      <form onSubmit={onSubmit}>
        <h1>Profile</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <label>Name</label>
        <input
          type='text'
          value={profile.name}
          onChange={(e) => {
            setProfile({
              ...profile,
              name: e.target.value,
            });
          }}
        />
        <label>City</label>
        <select
          onChange={(e) =>
            setProfile({
              ...profile,
              city: e.target.value,
            })
          }
          value={profile.city}
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
          value={profile.startDate}
          onChange={(e) => {
            setProfile({
              ...profile,
              startDate: e.target.value,
            });
          }}
        />
        <label>End Date</label>
        <input
          type='date'
          value={profile.endDate}
          onChange={(e) => {
            setProfile({
              ...profile,
              endDate: e.target.value,
            });
          }}
        />
        <label>Gender</label>
        <select
          onChange={(e) =>
            setProfile({
              ...profile,
              gender: e.target.value,
            })
          }
          value={profile.gender}
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
          value={profile.guests}
          onChange={(e) => {
            setProfile({
              ...profile,
              guests: e.target.value < 0 ? 0 : parseInt(e.target.value),
            });
          }}
        />
        <label>Kids</label>
        <select
          onChange={(e) =>
            setProfile({
              ...profile,
              kids: e.target.value,
            })
          }
          value={profile.kids}
        >
          <option disabled>Choose...</option>
          <option default value={true}>
            No kids
          </option>
          <option value={false}>Kids are welcome</option>
        </select>
        <input type='submit' value='SUBMIT' />
      </form>
    </>
  );
};

export default Profile;
