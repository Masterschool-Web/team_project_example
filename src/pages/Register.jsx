import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { processFirebaseErrors } from "../firebase/errors";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        <h1>Signup</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <label>Email</label>
        <input
          type='text'
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <label>Password</label>
        <input
          type='password'
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <input type='submit' value='SUBMIT' />
      </form>
      <p>
        Already has an account? <Link to='/login'>login</Link>
      </p>
    </>
  );
};

export default Register;
