import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const Middleware = () => {
    const isUser = localStorage.getItem("userData");

    if(!isUser) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
}

export default Middleware;