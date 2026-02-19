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
import { ThemeProvider } from "@mui/material/styles";
import { customTooltip } from "../styles/CustomTooltip";
import { useLocation, useNavigate } from "react-router-dom";
import { GetInformationFromToken } from "../utils/decodeToken";
import { Button, Tooltip } from "@mui/material";
import { useLogout } from "../utils/auth";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = GetInformationFromToken("custom:role");
  const logout = useLogout();

  const getLinkClass = (path) => {
    return location.pathname === path ? "bg-orange" : "hover:bg-dark-blue";
  };

  const handleLinkClick = (path) => {
    // Nawigacja nawet do tej samej ścieżki, wymusza rerender
    navigate(path, { replace: false });
  };

  return (
    <ThemeProvider theme={customTooltip}>
      <aside className="fixed top-0 left-0 bg-light-grey text-white w-16 h-screen flex flex-col transition-all duration-300">
        <div className="h-36 flex justify-center items-center p-1 relative">
          <Tooltip title="Strona główna" placement="right">
            <Button onClick={() => handleLinkClick("/homepage")} className="w-32 p-0">
              <img className="h-full w-full" src="/n20logo.png" alt="Logo" />
            </Button>
          </Tooltip>
        </div>
        <nav className="flex-1">
          <ul>
            <li className={`w-full h-14 flex justify-start items-center ${getLinkClass("/oferty")}`}>
              <Tooltip title="Oferty" placement="right">
                <Button
                  onClick={() => handleLinkClick("/oferty")}
                  className="flex items-center justify-start text-xl ml-4 w-full h-full"
                  startIcon={<LocalOffer sx={{ marginRight: "6px" }} />}
                />
              </Tooltip>
            </li>

            <li className={`w-full h-14 flex justify-start items-center ${getLinkClass("/ciekawe-oferty")}`}>
              <Tooltip title="Ciekawe oferty" placement="right">
                <Button
                  onClick={() => handleLinkClick("/ciekawe-oferty")}
                  className="flex items-center justify-start text-xl ml-4 w-full h-full"
                  startIcon={<Star sx={{ marginRight: "6px" }} />}
                />
              </Tooltip>
            </li>

            <li className={`w-full h-14 flex justify-start items-center ${getLinkClass("/klienci")}`}>
              <Tooltip title="Klienci" placement="right">
                <Button
                  onClick={() => handleLinkClick("/klienci")}
                  className="flex items-center justify-start text-xl ml-4 w-full h-full"
                  startIcon={<Group sx={{ marginRight: "6px" }} />}
                />
              </Tooltip>
            </li>

            {userRole === "admin" && (
              <>
                <li className={`w-full h-14 flex justify-start items-center ${getLinkClass("/kosz-klientow")}`}>
                  <Tooltip title="Kosz klientów" placement="right">
                    <Button
                      onClick={() => handleLinkClick("/kosz-klientow")}
                      className="flex items-center justify-start text-xl ml-4 w-full h-full"
                      startIcon={<PersonRemove sx={{ marginRight: "6px" }} />}
                    />
                  </Tooltip>
                </li>

                <li className={`w-full h-14 flex justify-start items-center ${getLinkClass("/uzytkownicy")}`}>
                  <Tooltip title="Użytkownicy" placement="right">
                    <Button
                      onClick={() => handleLinkClick("/uzytkownicy")}
                      className="flex items-center justify-start text-xl ml-4 w-full h-full"
                      startIcon={<Groups sx={{ marginRight: "6px" }} />}
                    />
                  </Tooltip>
                </li>

                <li className={`w-full h-14 flex justify-start items-center ${getLinkClass("/logi")}`}>
                  <Tooltip title="Administrator" placement="right">
                    <Button
                      onClick={() => handleLinkClick("/logi")}
                      className="flex items-center justify-start text-xl ml-4 w-full h-full"
                      startIcon={<Description sx={{ marginRight: "6px" }} />}
                    />
                  </Tooltip>
                </li>
              </>
            )}

            <li className={`w-full h-14 flex justify-start items-center ${getLinkClass("/ustawienia")}`}>
              <Tooltip title="Ustawienia" placement="right">
                <Button
                  onClick={() => handleLinkClick("/ustawienia")}
                  className="flex items-center justify-start text-xl ml-4 w-full h-full"
                  startIcon={<Settings sx={{ marginRight: "6px" }} />}
                />
              </Tooltip>
            </li>
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
                "& .MuiButton-startIcon": { margin: 0 },
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
