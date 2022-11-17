import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { processFirebaseErrors } from "../firebase/errors";

const Profile = () => {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [startDate, setStartDate] = use;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // go to db
      await register({ email, password });
      setLoading(false);

      // navigate to a different page
      navigate("/");
    } catch (err) {
      setLoading(false);
      console.log(err);
      setError(processFirebaseErrors(err.message));
    }
  };

  if (loading) return <div>loading...</div>;

  return (
    <>
      <Link to='/'>Back</Link>
      <form onSubmit={onSubmit}>
        <h1>Profile</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <label>Name</label>
        <input
          type='text'
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <label>City</label>
        <select>
          <option>Choose...</option>
          <option>Amsterdam</option>
          <option>Utrecht</option>
          <option>Rotterdam</option>
          <option>Den Haag</option>
          <option>Tilburg</option>
        </select>
        <label>Name</label>
        <input
          type='text'
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <label>Name</label>
        <input
          type='text'
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />

        <input type='submit' value='SUBMIT' />
      </form>
    </>
  );
};

export default Profile;
