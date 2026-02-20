import { Navigate } from "react-router-dom";
import { tokenStorage } from "../shared/storage/tokenStorage";

export default function RutaProtegida({ children }) {
  const access = tokenStorage.getAccess();
  if (!access) return <Navigate to="/login" replace />;
  return children;
}