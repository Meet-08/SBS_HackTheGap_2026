import { useAppDispatch } from "@/app/hooks";
import "@/css/login.css";
import { loginUser } from "@/redux/authSlice";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import facebook from "../assets/icons/facebook.png";
import google from "../assets/icons/google.png";
import instagram from "../assets/icons/instagram.png";
import signUp from "../assets/icons/signUp.png";
import x from "../assets/icons/x.png";

function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Email and password required");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert("Enter valid email");
      return;
    }
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      navigate("/");
    } catch (error) {
      alert("Login failed. Please check your credentials and try again.");
      return;
    }
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
        <input
          className="inputFull"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          className="inputFull"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Link className="forgot" to="/forgetpass">
          Forgot Password?
        </Link>

        <button className="button" onClick={handleLogin}>
          Login
        </button>

        <div className="logos">
          <a href="http://www.google.com">
            <img src={google} alt="google logo" />
          </a>
          <a href="http://www.facebook.com">
            <img src={facebook} alt="facebook logo" />
          </a>
          <a href="http://www.insatgram.com">
            <img src={instagram} alt="instagram logo" />
          </a>
          <a href="http://www.twitter.com">
            <img src={x} alt="x logo" />
          </a>
        </div>

        <p className="text">
          Don't have an account?{" "}
          <Link className="link" to="/register">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
