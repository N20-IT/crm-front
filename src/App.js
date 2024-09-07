import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./styles/custom.css";
import { useAuth } from "./utils/auth";
import SignIn from "./SignIn";
import App2 from "./App2";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
function App() {
  const navigate = useNavigate();
  const isAuthenticated = useAuth();

  // useEffect(() => {
  //   isAuthenticated ? navigate("/homepage") : navigate("/login");
  // }, [isAuthenticated, navigate]);
  return (
    <Routes>
      <Route path="/homepage" element={<HomePage />} />
      <Route path="/" element={<LoginPage />} />
      <Route path="/app" element={<App2 />} />
      <Route path="/signin" element={<SignIn />} />
      {/* <Route path="/login" element={<LoginPage />} /> */}
    </Routes>
  );
}

export default App;
