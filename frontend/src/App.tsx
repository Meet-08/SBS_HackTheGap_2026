import { Home, Login, Predict, Register, Result, UserDashboard } from "@/pages";
import { Route, Routes } from "react-router";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/predict" element={<Predict />} />
      <Route path="/predict-result" element={<Result />} />
    </Routes>
  );
};

export default App;
