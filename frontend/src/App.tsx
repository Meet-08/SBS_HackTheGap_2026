import ProtectedRoute from "@/components/protected-route";
import { Home, Login, Predict, Register, Result, UserDashboard } from "@/pages";
// import ForgetPass from "@/pages/forgetpass";
import { useAppDispatch } from "@/app/hooks";
import { getCurrentUser } from "@/redux/authSlice";
import { useEffect } from "react";
import { Route, Routes } from "react-router";

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute allowedRoles={["USER"]} />}>
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/predict" element={<Predict />} />
        <Route path="/predict-result" element={<Result />} />
      </Route>
    </Routes>
  );
};

export default App;
