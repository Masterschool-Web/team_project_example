import { useNavigate } from "react-router-dom";
import "./App.css";
import { useAuth } from "./context/authContext";

function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (user)
    return (
      <div>
        <h2>Hello {user.email}</h2>
        <button onClick={logout}>LOGOUT</button>
      </div>
    );
  return (
    <div className='App'>
      <h1>Open Doors</h1>
      <h2>Welcome!</h2>
      <button onClick={() => navigate("/login")}>LOGIN</button>
      <button onClick={() => navigate("/register")}>SIGNUP</button>
    </div>
  );
}

export default App;
