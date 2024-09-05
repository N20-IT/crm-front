import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/custom.css";
import SignIn from "./SignIn";
import App2 from "./App2";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/" element={<App2 />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
