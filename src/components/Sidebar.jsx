import React from "react";
import {
  LocalOffer,
  Group,
  Star,
  Groups,
  Description,
  Logout,
} from "@mui/icons-material";
import { ThemeProvider } from "@mui/material/styles";
import { customTooltip } from "../styles/CustomTooltip";
import { Link, useLocation } from "react-router-dom";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { GetInformationFromToken } from "../utils/decodeToken";
import { Button, Tooltip } from "@mui/material";
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
    <ThemeProvider theme={customTooltip}>
      <aside
        className={`fixed top-0 left-0 bg-light-grey text-white ${
          isCollapsed ? "w-16" : "w-48"
        } h-screen flex flex-col transition-all duration-300`}
      >
        <div
          className={`h-36 flex justify-center items-center ${
            isCollapsed ? "p-1" : "p-6"
          } relative`}
        >
          <Tooltip title="Strona główna" placement="right">
            <Link to="/homepage" className="w-32">
              <img className={`h-full w-full `} src="/n20logo.png" alt="Logo" />
            </Link>
          </Tooltip>
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
              <Tooltip title="Oferty" placement="right">
                <Link
                  to="/oferty"
                  className="flex items-center justify-start text-xl ml-4 w-full h-full"
                >
                  <LocalOffer sx={{ marginRight: "6px" }} />
                  {!isCollapsed && <span>Oferty</span>}
                </Link>
              </Tooltip>
            </li>
            <li
              className={`w-full h-14 flex justify-start items-center ${getLinkClass(
                "/klienci"
              )}`}
            >
              <Tooltip title="Klienci" placement="right">
                <Link
                  to="/klienci"
                  className="flex items-center justify-start text-xl ml-4 w-full h-full"
                >
                  <Group sx={{ marginRight: "6px" }} />
                  {!isCollapsed && <span>Klienci</span>}
                </Link>
              </Tooltip>
            </li>
            <li
              className={`w-full h-14 flex justify-start items-center ${getLinkClass(
                "/ciekawe-oferty"
              )}`}
            >
              {" "}
              <Tooltip title="Ciekawe oferty" placement="right">
                <Link
                  to="/ciekawe-oferty"
                  className="flex items-center justify-start text-xl ml-4 w-full h-full"
                >
                  <Star sx={{ marginRight: "6px" }} />
                  {!isCollapsed && <span>Ciek. oferty</span>}
                </Link>
              </Tooltip>
            </li>
            {userRole === "admin" && (
              <>
                <li
                  className={`w-full h-14 flex justify-start items-center ${getLinkClass(
                    "/uzytkownicy"
                  )}`}
                >
                  <Tooltip title="Użytkownicy" placement="right">
                    <Link
                      to="/uzytkownicy"
                      className="flex items-center justify-start text-xl ml-4 w-full h-full"
                    >
                      <Groups sx={{ marginRight: "6px" }} />
                      {!isCollapsed && <span>Użytkownicy</span>}
                    </Link>
                  </Tooltip>
                </li>
                <li
                  className={`w-full h-14 flex justify-start items-center ${getLinkClass(
                    "/logi"
                  )}`}
                >
                  <Tooltip title="Administrator" placement="right">
                    <Link
                      to="/logi"
                      className="flex items-center justify-start text-xl ml-4 w-full h-full"
                    >
                      <Description sx={{ marginRight: "6px" }} />
                      {!isCollapsed && <span>Administrator</span>}
                    </Link>
                  </Tooltip>
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
          <Tooltip title="Wyloguj się" placement="right">
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
                "& .MuiButton-startIcon": {
                  margin: isCollapsed ? 0 : undefined,
                },
              }}
              startIcon={<Logout />}
              onClick={logout}
            >
              {!isCollapsed && "Wyloguj się"}
            </Button>
          </Tooltip>
        </div>
      </aside>
    </ThemeProvider>
  );
};

export default Sidebar;
