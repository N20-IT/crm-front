import React from "react";
import {
  LocalOffer,
  Group,
  Star,
  Groups,
  Description,
  Logout,
  PersonRemove,
  Settings,
} from "@mui/icons-material";
import { ThemeProvider, Tooltip } from "@mui/material";
import { customTooltip } from "../styles/CustomTooltip";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GetInformationFromToken } from "../utils/decodeToken";
import { useLogout } from "../utils/auth";

const Sidebar = () => {
  const location = useLocation();
  const userRole = GetInformationFromToken("custom:role");
  const logout = useLogout();
  const navigate = useNavigate();

  const getLinkClass = (path) =>
    location.pathname === path
      ? "bg-orange"
      : "hover:bg-dark-blue";

  const handleNavClick = (path) => {
    if (location.pathname === path) navigate(0);
  };

  const tileClass =
    "w-full h-14 flex items-center justify-start transition-colors duration-500";

  return (
    <ThemeProvider theme={customTooltip}>
      <aside className="fixed top-0 left-0 w-16 h-screen bg-light-grey text-white flex flex-col">

        {/* ===== LOGO ===== */}
        <div className="w-full p-1 h-20 flex items-center justify-center">
          <div className="w-full h-full flex justify-center items-center cursor-default">
            <img
              src="/n20logo.png"
              alt="Logo"
              className="h-full object-contain"
            />
          </div>
        </div>

        {/* ===== MENU ===== */}
        <nav className="flex-1">
          <ul>

            <li className={`${tileClass} ${getLinkClass("/oferty")}`}>
              <Tooltip title="Oferty" placement="right">
                <Link
                  to="/oferty"
                  onClick={() => handleNavClick("/oferty")}
                  className="ml-4 w-full h-full flex items-center"
                >
                  <LocalOffer />
                </Link>
              </Tooltip>
            </li>

            <li className={`${tileClass} ${getLinkClass("/ciekawe-oferty")}`}>
              <Tooltip title="Ciekawe oferty" placement="right">
                <Link
                  to="/ciekawe-oferty"
                  onClick={() => handleNavClick("/ciekawe-oferty")}
                  className="ml-4 w-full h-full flex items-center"
                >
                  <Star />
                </Link>
              </Tooltip>
            </li>

            <li className={`${tileClass} ${getLinkClass("/klienci")}`}>
              <Tooltip title="Klienci" placement="right">
                <Link
                  to="/klienci"
                  onClick={() => handleNavClick("/klienci")}
                  className="ml-4 w-full h-full flex items-center"
                >
                  <Group />
                </Link>
              </Tooltip>
            </li>

            {userRole === "admin" && (
              <>
                <li className={`${tileClass} ${getLinkClass("/kosz-klientow")}`}>
                  <Tooltip title="Kosz klientów" placement="right">
                    <Link
                      to="/kosz-klientow"
                      onClick={() => handleNavClick("/kosz-klientow")}
                      className="ml-4 w-full h-full flex items-center"
                    >
                      <PersonRemove />
                    </Link>
                  </Tooltip>
                </li>

                <li className={`${tileClass} ${getLinkClass("/uzytkownicy")}`}>
                  <Tooltip title="Użytkownicy" placement="right">
                    <Link
                      to="/uzytkownicy"
                      onClick={() => handleNavClick("/uzytkownicy")}
                      className="ml-4 w-full h-full flex items-center"
                    >
                      <Groups />
                    </Link>
                  </Tooltip>
                </li>

                <li className={`${tileClass} ${getLinkClass("/logi")}`}>
                  <Tooltip title="Administrator" placement="right">
                    <Link
                      to="/logi"
                      onClick={() => handleNavClick("/logi")}
                      className="ml-4 w-full h-full flex items-center"
                    >
                      <Description />
                    </Link>
                  </Tooltip>
                </li>

                <li className={`${tileClass} ${getLinkClass("/ustawienia")}`}>
                  <Tooltip title="Ustawienia" placement="right">
                    <Link
                      to="/ustawienia"
                      onClick={() => handleNavClick("/ustawienia")}
                      className="ml-4 w-full h-full flex items-center"
                    >
                      <Settings />
                    </Link>
                  </Tooltip>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* ===== LOGOUT ===== */}
        <div className={`${tileClass} bg-orange hover:opacity-90`}>
          <Tooltip title="Wyloguj się" placement="right">
            <button
              onClick={logout}
              className="ml-4 w-full h-full flex items-center"
            >
              <Logout />
            </button>
          </Tooltip>
        </div>

      </aside>
    </ThemeProvider>
  );
};

export default Sidebar;