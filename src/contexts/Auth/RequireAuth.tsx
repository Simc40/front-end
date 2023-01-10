import React, { useContext } from "react";
import { Login } from "../../pages/Login/Login";
import { AuthContext } from "./AuthContext";

export const RequireAuth = ({ children }: { children: JSX.Element}) => {
    const auth = useContext(AuthContext);

    if(!auth.loggedIn){
        return <Login/>
    }

    return children;
}