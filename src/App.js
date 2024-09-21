import React from "react";
import { Routes, Route } from "react-router-dom";
import "./styles/custom.css";
import SignIn from "./SignIn";
import App2 from "./App2";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import OffersPage from "./pages/OffersPage";
import ClientsPage from "./pages/ClientsPage";
import InterestingOffersPage from "./pages/InterestingOffersPage";
import LogsPage from "./pages/LogsPage";
import UsersPage from "./pages/UsersPage";
import ForgottenPasswordPage from "./pages/ForgottenPasswordPage";
import OfferDetailsPage from "./pages/OfferDetailsPage";
function App() {
  return (
    <Routes>
      <Route path="/homepage" element={<HomePage />} />
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/app" element={<App2 />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/oferty" element={<OffersPage />} />
      <Route path="/klienci" element={<ClientsPage />} />
      <Route path="/ciekawe-oferty" element={<InterestingOffersPage />} />
      <Route path="/logi" element={<LogsPage />} />
      <Route path="/uzytkownicy" element={<UsersPage />} />
      <Route path="/zapomniane-haslo" element={<ForgottenPasswordPage />} />
      <Route path="/konkretna-oferta" element={<OfferDetailsPage />} />
    </Routes>
  );
}

export default App;
