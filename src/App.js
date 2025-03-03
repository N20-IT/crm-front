import React from "react";
import { Routes, Route } from "react-router-dom";
import "./styles/custom.css";
import LoginPage from "./pages/LoginPage";
import OffersPage from "./pages/OffersPage";
import ClientsPage from "./pages/ClientsPage";
import InterestingOffersPage from "./pages/InterestingOffersPage";
import LogsPage from "./pages/LogsPage";
import UsersPage from "./pages/UsersPage";
import ForgottenPasswordPage from "./pages/ForgottenPasswordPage";
function App() {
  return (
    <Routes>
      <Route path="/homepage" element={<OffersPage />} />
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/oferty" element={<OffersPage />} />
      <Route path="/klienci" element={<ClientsPage />} />
      <Route path="/klienci/:id" element={<ClientsPage />} />
      <Route path="/ciekawe-oferty" element={<InterestingOffersPage />} />
      <Route path="/logi" element={<LogsPage />} />
      <Route path="/uzytkownicy" element={<UsersPage />} />
      <Route path="/zapomniane-haslo" element={<ForgottenPasswordPage />} />
      <Route path="/oferty/:id" element={<OffersPage />} />
    </Routes>
  );
}

export default App;
