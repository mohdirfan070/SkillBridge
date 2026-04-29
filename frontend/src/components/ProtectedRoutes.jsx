// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAppAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAppAuth();
    // console.log(user);
  if (loading) return <p>Loading...</p>;

  // not logged in
  if (!user) return <Navigate to="/login" />;

  // no role selected
  if (!user.role) return <Navigate to="/select-role" />;

  // wrong role
  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}