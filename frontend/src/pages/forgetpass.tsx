import { useNavigate } from "react-router";
import { useState } from "react";
import "./forgetpass.css";

function ForgetPass() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

const handleReset = () => {
  if (!email) {
    alert("Please enter your email");
    return;
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    alert("Enter a valid email");
    return;
  }

  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    alert("No user registered");
    return;
  }

  const { email: savedEmail } = JSON.parse(storedUser);

  if (email !== savedEmail) {
    alert("Email not registered");
    return; 
  }

  alert("Password reset link sent!");
  navigate("/login");
};

  return (
    <div className="page">
      <div className="card">
        <h2>Reset Password</h2>

        <p className="subtitle">
          Enter your email to receive a password reset link
        </p>

        <input
          className="inputFull"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="button" 
          className="button"
          onClick={handleReset}
        >
          Send Reset Link
        </button>

        <p className="text">
          Back to{" "}
          <span
            className="link"
            onClick={() => navigate("/login")}
            style={{ cursor: "pointer" }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default ForgetPass;
