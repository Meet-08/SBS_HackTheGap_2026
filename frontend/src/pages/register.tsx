import { useAppDispatch } from "@/app/hooks";
import "@/css/register.css";
import { registerUser } from "@/redux/authSlice";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import signUp from "../assets/icons/signUp.png";

function Register() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    pinCode: "",
    password: "",
    confirm: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof typeof formData
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(formData);

    if (
      !formData.email ||
      !formData.address ||
      !formData.pinCode ||
      !formData.password ||
      !formData.confirm
    ) {
      alert("All fields are required");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      alert("Enter valid email");
      return;
    }

    if (!/^\d{6}$/.test(formData.pinCode)) {
      alert("Pincode must be 6 digits");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      const { confirm, ...registerData } = formData;
      await dispatch(registerUser(registerData)).unwrap();
      navigate("/");
    } catch (error) {
      alert("Registration failed. Please try again.");
      return;
    }
  };

  return (
    <div className="page">
      <div className="card">
        <img src={signUp} alt="Agri-Tech Logo" className="logo" />
        <h3 className="logoname">Agri-Tech</h3>
        <h2>Create an Account</h2>

        <form className="form" onSubmit={handleSubmit}>
          <div className="row">
            <input
              className="input"
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) => handleChange(e, "firstName")}
            />
            <input
              className="input"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) => handleChange(e, "lastName")}
            />
          </div>

          <input
            className="inputFull"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => handleChange(e, "email")}
          />
          <input
            className="inputFull"
            placeholder="Address"
            value={formData.address}
            onChange={(e) => handleChange(e, "address")}
          />
          <input
            className="inputFull"
            placeholder="Pincode"
            value={formData.pinCode}
            onChange={(e) => handleChange(e, "pinCode")}
          />
          <input
            className="inputFull"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => handleChange(e, "password")}
          />
          <input
            className="inputFull"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirm}
            onChange={(e) => handleChange(e, "confirm")}
          />
          <button type="submit" className="button">
            Sign Up
          </button>
        </form>

        <p className="text">
          Already have an account?{" "}
          <Link to="/login" className="link">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
