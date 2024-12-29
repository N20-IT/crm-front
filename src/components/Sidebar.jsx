import React, { useState } from "react";
import {
  LocalOffer,
  Group,
  Star,
  Groups,
  Description,
  Logout,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { GetInformationFromToken } from "../utils/decodeToken";
import { Button } from "@mui/material";
import { useLogout } from "../utils/auth";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "../redux/sidebarSlice";

const Sidebar = () => {
  const location = useLocation();
  const userRole = GetInformationFromToken("custom:role");
  const logout = useLogout();

  const isCollapsed = useSelector((state) => state.sidebar.isCollapsed);
  const dispatch = useDispatch();

  const getLinkClass = (path) => {
    return location.pathname === path ? "bg-orange" : "hover:bg-dark-blue";
  };

  return (
    <aside
      className={`fixed top-0 left-0 bg-light-grey text-white ${
        isCollapsed ? "w-16" : "w-48"
      } h-screen flex flex-col transition-all duration-300`}
    >
      <div
        className={`h-24 flex justify-between items-center ${
          isCollapsed ? "p-1" : "p-6"
        } relative`}
      >
        <Link to="/homepage" className="w-24">
          <img className={`h-full w-full `} src="/n20logo.png" alt="Logo" />
        </Link>
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="absolute right-[-12px] top-1/2 transform -translate-y-1/2 bg-dark-blue text-white rounded-full p-2 hover:bg-orange"
        >
          {isCollapsed ? <GoSidebarCollapse /> : <GoSidebarExpand />}
        </button>
      </div>
      <nav className="flex-1">
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
              {!isCollapsed && <span>Oferty</span>}
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
              {!isCollapsed && <span>Klienci</span>}
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
              {!isCollapsed && <span>Ciek. oferty</span>}
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
                  {!isCollapsed && <span>Użytkownicy</span>}
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
                  {!isCollapsed && <span>Administrator</span>}
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <div
        className={`fixed bottom-3 p-4 flex justify-center items-center ${
          isCollapsed ? "w-16" : "w-39"
        }`}
      >
        <Button
          fullWidth={!isCollapsed}
          variant="contained"
          sx={{
            backgroundColor: "#FC8721",
            color: "white",
            borderRadius: "32px",
            fontSize: isCollapsed ? "0px" : "16px",
            fontFamily: "Poppins",
            textTransform: "none",
            padding: isCollapsed ? "10px" : "10px 20px",
            transition: "all 0.3s ease-in-out",
          }}
          startIcon={<Logout />}
          onClick={logout}
        >
          {!isCollapsed && "Wyloguj się"}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
