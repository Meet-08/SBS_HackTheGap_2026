import { useAppSelector } from "@/app/hooks";
import { Loader } from "@/components/ui/loader";
import type { Role } from "@/types";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = ({ allowedRoles }: { allowedRoles: Role[] }) => {
  const { user, loading } = useAppSelector((state) => state.authReducer);

  if (loading) return <Loader />;

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
