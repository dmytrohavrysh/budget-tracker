import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function PrivateRoute() {
    const {currUser} = useAuth();

    return ( currUser ? <Outlet /> : <Navigate to="/login" />)
}
