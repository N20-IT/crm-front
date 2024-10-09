import React from "react";
import {
  LocalOffer,
  Group,
  Star,
  Groups,
  Description,
  Logout,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { GetUserRoleFromToken } from "../utils/decodeToken";
import { Button } from "@mui/material";
import { useLogout } from "../utils/auth";

const Sidebar = () => {
  const location = useLocation();
  const userRole = GetUserRoleFromToken();
  const logout = useLogout();

  const getLinkClass = (path) => {
    return location.pathname === path ? "bg-orange" : "hover:bg-dark-blue";
  };
  return (
    <aside className="fixed top-0 left-0 bg-light-grey text-white w-48 h-screen flex justify-start flex-col">
      <div className="h-36 flex justif-center items-center">
        <Link to="/homepage" className="w-32 mx-auto">
          <img className=" h-full w-full " src="/n20logo.png" alt="Logo" />
        </Link>
      </div>
      <nav>
        <ul>
          <li
            className={`w-full h-14 flex justify-start items-center ${getLinkClass(
              "/oferty"
            )}`}
          >
            <Link
              to="/oferty"
              className="flex items-center justify-start text-xl ml-4 w-full h-full"
            >
              <LocalOffer sx={{ marginRight: "6px" }} />
              <span>Oferty</span>
            </Link>
          </li>
          <li
            className={`w-full h-14 flex justify-start items-center ${getLinkClass(
              "/klienci"
            )}`}
          >
            <Link
              to="/klienci"
              className="flex items-center justify-start text-xl ml-4 w-full h-full"
            >
              <Group sx={{ marginRight: "6px" }} />
              <span>Klienci</span>
            </Link>
          </li>
          <li
            className={`w-full h-14 flex justify-start items-center ${getLinkClass(
              "/ciekawe-oferty"
            )}`}
          >
            <Link
              to="/ciekawe-oferty"
              className="flex items-center justify-start text-xl ml-4 w-full h-full"
            >
              <Star sx={{ marginRight: "6px" }} />
              <span>Ciek. oferty</span>
            </Link>
          </li>
          {userRole === "admin" && (
            <>
              <li
                className={`w-full h-14 flex justify-start items-center ${getLinkClass(
                  "/uzytkownicy"
                )}`}
              >
                <Link
                  to="/uzytkownicy"
                  className="flex items-center justify-start text-xl ml-4 w-full h-full"
                >
                  <Groups sx={{ marginRight: "6px" }} />
                  <span>Użytkownicy</span>
                </Link>
              </li>
              <li
                className={`w-full h-14 flex justify-start items-center ${getLinkClass(
                  "/logi"
                )}`}
              >
                <Link
                  to="/logi"
                  className="flex items-center justify-start text-xl ml-4 w-full h-full"
                >
                  <Description sx={{ marginRight: "6px" }} />
                  <span>Logi</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <div className="fixed bottom-3 p-4">
        <Button
          fullWidth
          variant="contained"
          sx={{
            backgroundColor: "#FC8721",
            color: "white",
            borderRadius: "32px",
            fontSize: "16px",
            fontFamily: "Poppins",
            textTransform: "none",
          }}
          startIcon={<Logout />}
          onClick={logout}
        >
          Wyloguj się
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
