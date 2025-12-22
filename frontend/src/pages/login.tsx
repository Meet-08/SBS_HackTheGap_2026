import { useNavigate } from "react-router";
import { useState } from "react";
import "./login.css";
import google from "../assets/icons/google.png";
import facebook from "../assets/icons/facebook.png";
import instagram from "../assets/icons/instagram.png";
import x from "../assets/icons/x.png";
import signUp from "../assets/icons/signUp.png"

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
    const savedUser = localStorage.getItem("user");

  if (!savedUser) {
    alert("No user registered");
    return;
  }

  const { email: savedEmail, password: savedPassword } =
    JSON.parse(savedUser);

  if (email !== savedEmail || password !== savedPassword) {
    alert("Email or password is incorrect");
    return;
  }
  navigate("/");
  };

  return (
    <div className="page">
      <div className="card">
        <div className="mainlogo">
          <img src={signUp} alt="mainlogo" />
        </div>

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

              <p
        className="forgot"
        onClick={() => navigate("/forgetpass")}>
        Forgot Password?
      </p>

        <button className="button" onClick={handleLogin}>
          Login
        </button>

      <div className="logos">
        <a href="http://www.google.com"><img src={google} alt="google logo"/></a>
        <a href="http://www.facebook.com"><img src={facebook} alt="facebook logo"/></a>
        <a href="http://www.insatgram.com"><img src={instagram} alt="instagram logo"/></a>
        <a href="http://www.twitter.com"><img src={x} alt="x logo"/></a>
      </div>

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