import React from "react";
import { Routes, Route } from "react-router-dom";
import "./styles/custom.css";
import LoginPage from "./pages/LoginPage";
import OffersPage from "./pages/OffersPage";
import ClientsPage from "./pages/ClientsPage";
import InterestingOffersPage from "./pages/InterestingOffersPage";
import UsersPage from "./pages/UsersPage";
import ForgottenPasswordPage from "./pages/ForgottenPasswordPage";
import DeletedClientsPage from "./pages/DeletedClientsPage";
import ConfigurationPanel from "./pages/ConfigurationPanel";
import LogsPage from "./pages/LogsPage";
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
      <Route path="/ustawienia" element={<ConfigurationPanel />} />
      <Route path="/uzytkownicy" element={<UsersPage />} />
      <Route path="/zapomniane-haslo" element={<ForgottenPasswordPage />} />
      <Route path="/oferty/:id" element={<OffersPage />} />
      <Route path="/kosz-klientow" element={<DeletedClientsPage />} />
      <Route path="/logi" element={<LogsPage />} />
    </Routes>
  );
}

export default App;
