import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Context";

const Register = () => {
  const [email, setEmail] = useState("david@david.com");
  const [password, setPassword] = useState("david1234");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, user } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      await register({ email, password });
      setLoading(false);

      //   navigate("/");
      setSuccess(true);
    } catch (err) {
      console.log(err);
      setError(err.message);
      setEmail("");
      setPassword("");
    }
  };

  if (loading) return <div>loading...</div>;

  if (success) return <div>{user.email}</div>;

  if (error) return <div>{error}</div>;

  return (
    <form
      onSubmit={onSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        width: "400px",
        padding: "50px",
      }}
    >
      <label>Email</label>
      <input
        type='text'
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <label>Password</label>
      <input
        type='password'
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <input type='submit' value='Submit' />
    </form>
  );
};

export default Register;
