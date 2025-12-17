import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleLogin = () => {
    if (!email || !password) {
      alert("Email and password required");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert("Enter valid email");
      return;
    }

    // later backend auth
    navigate("/");
  };

  return (
    <div className="page">
      <div className="card">
        <div className="logo">Logo</div>

        <h2>Welcome Back!</h2>
        <p className="subtitle">Log in to access your crop insights.</p>

        <label>Email Address</label>
        <input className="inputFull" placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input className="inputFull" type="password" placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <p className="forgot">Forgot Password?</p>

        <button className="button" onClick={handleLogin}>
          Login
        </button>

        <p className="text">
          Don't have an account?{" "}
          <span className="link" onClick={() => navigate("/register")}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
