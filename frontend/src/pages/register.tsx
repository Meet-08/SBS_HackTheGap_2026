import { useNavigate } from "react-router";
import { useState } from "react";
import "./register.css";
import signUp from "../assets/icons/signUp.png";

function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pincode, setPincode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSignup = () => {

    if (!email || !pincode || !password || !confirm) {
      alert("All fields are required");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert("Enter valid email");
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      alert("Pincode must be 6 digits");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }
    // later backend call
    navigate("/login");

    localStorage.setItem(
  "user",
  JSON.stringify({
    email,
    password,
  })
);
  };
  return (
    <div className="page">
      <div className="card">
        <img src={signUp} alt="Agri-Tech Logo" className="logo" />
        <h3 className="logoname">Agri-Tech</h3>
        <h2>Create an Account</h2>

        <div className="form">
          <div className="row">
          <input className="input" placeholder="First Name" />
          <input className="input" placeholder="Last Name" />
        </div>

        <input className="inputFull" placeholder="Email Address" onChange={(e) => setEmail(e.target.value)}/>
        <input className="inputFull" placeholder="Address" />
        <input className="inputFull" placeholder="Pincode" onChange={(e) => setPincode(e.target.value)}/>
        <input
          className="inputFull"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="inputFull"
          type="password"
          placeholder="Confirm Password"
          onChange={(e) => setConfirm(e.target.value)}
        />
        </div>

        <button type="button" className="button" onClick={handleSignup}>
          Sign Up
        </button>


        <p className="text">
          Already have an account? <span onClick={()=>navigate("/login")}
          style={{cursor:"pointer"}} className="link">Log in</span>
        </p>
      </div>
    </div>
  );
}

export default Register;
