import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/auth";

//TODO
function ForgottenPasswordPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuth();

  useEffect(() => {
    if (!isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);
  return (
    <div className=" flex items-center justify-center h-screen">
      <h1 className=" font-bold text-5xl">Zapomniane hasło</h1>
    </div>
  );
}

export default ForgottenPasswordPage;
