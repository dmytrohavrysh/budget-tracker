import { useContext } from "react";
import { AuthContext } from "../providers/context/Auth";

function useAuth() {
    return useContext(AuthContext);
}

export {useAuth};