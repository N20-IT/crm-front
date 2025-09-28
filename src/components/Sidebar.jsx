import React from "react";
import {
  LocalOffer,
  Group,
  Star,
  Groups,
  Description,
  Logout,
  PersonRemove,
} from "@mui/icons-material";
import { ThemeProvider } from "@mui/material/styles";
import { customTooltip } from "../styles/CustomTooltip";
import { Link, useLocation } from "react-router-dom";
import { GetInformationFromToken } from "../utils/decodeToken";
import { Button, Tooltip } from "@mui/material";
import { useLogout } from "../utils/auth";

const Sidebar = () => {
  const location = useLocation();
  const userRole = GetInformationFromToken("custom:role");
  const logout = useLogout();

  const getLinkClass = (path) => {
    return location.pathname === path ? "bg-orange" : "hover:bg-dark-blue";
  };

  return (
    <ThemeProvider theme={customTooltip}>
      <aside className="fixed top-0 left-0 bg-light-grey text-white w-16 h-screen flex flex-col transition-all duration-300">
        <div className="h-36 flex justify-center items-center p-1 relative">
          <Tooltip title="Strona główna" placement="right">
            <Link to="/homepage" className="w-32">
              <img className={`h-full w-full `} src="/n20logo.png" alt="Logo" />
            </Link>
          </Tooltip>
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
                </Link>
              </Tooltip>
            </li>

            <li
              className={`w-full h-14 flex justify-start items-center ${getLinkClass(
                "/kosz-klientow"
              )}`}
            >
              <Tooltip title="Kosz klientów" placement="right">
                <Link
                  to="/kosz-klientow"
                  className="flex items-center justify-start text-xl ml-4 w-full h-full"
                >
                  <PersonRemove sx={{ marginRight: "6px" }} />
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
                    </Link>
                  </Tooltip>
                </li>
              </>
            )}
          </ul>
        </nav>
        <div className="fixed bottom-3 p-4 flex justify-center items-center w-16">
          <Tooltip title="Wyloguj się" placement="right">
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#FC8721",
                color: "white",
                borderRadius: "32px",
                fontSize: "0px",
                fontFamily: "Poppins",
                textTransform: "none",
                padding: "10px",
                transition: "all 0.3s ease-in-out",
                "& .MuiButton-startIcon": {
                  margin: 0,
                },
              }}
              startIcon={<Logout />}
              onClick={logout}
            />
          </Tooltip>
        </div>
      </aside>
    </ThemeProvider>
  );
};

export default Sidebar;
