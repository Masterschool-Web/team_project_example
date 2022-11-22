import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import { useAuth } from "./context/authContext";
import { useProfile } from "./context/ProfileContext";

function App() {
  const { user, logout, userLoading } = useAuth();
  const { getAllProfiles, profiles } = useProfile();

  const navigate = useNavigate();

  useEffect(() => {
    getAllProfiles();
  }, []);

  if (userLoading) return <div>loading...</div>;
  if (user)
    return (
      <div>
        <h2>Hello {user.email}</h2>
        <button onClick={logout}>LOGOUT</button>
        <button onClick={() => navigate("/profile")}>PROFILE</button>
      </div>
    );
  return (
    <div className='App'>
      <h1>Open Doors</h1>
      <h2>Welcome!</h2>
      <button onClick={() => navigate("/login")}>LOGIN</button>
      <button onClick={() => navigate("/register")}>SIGNUP</button>
      <div>
        {profiles.map((profile) => (
          <div>
            <h2>{profile.name}</h2>
            <h3>{profile.email}</h3>
            <p>{profile.description}</p>
            <p>{profile.city}</p>
            <p>{profile.startDate}</p>
            <p>{profile.endDate}</p>
            <p>{profile.guests}</p>
            <p>{profile.gender}</p>
            <p>{profile.kids}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
