import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/auth";
import Sidebar from "../components/Sidebar";
import { GetUserRoleFromToken } from "../utils/decodeToken";

//TODO
function UsersPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuth();
  const userRole = GetUserRoleFromToken();

  useEffect(() => {
    if (!isAuthenticated || userRole !== "admin") navigate("/");
  }, [isAuthenticated, userRole, navigate]);

  return (
    <div className=" flex items-center justify-center h-screen ml-48">
      <Sidebar />
      <h1 className=" font-bold text-5xl">Użytkownicy</h1>
    </div>
  );
}

export default UsersPage;
