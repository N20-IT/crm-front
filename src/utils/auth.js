import { useCookies } from "react-cookie";
import { signOut } from "@aws-amplify/auth";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  useDeleteColumnConfig,
  useColumnConfig,
} from "../config/columnConfig";

/* =========================
   COOKIE SUPPORT
========================= */

export const cookiesEnabled = () => {
  try {
    document.cookie = "testcookie=1";
    const result = document.cookie.includes("testcookie");
    document.cookie =
      "testcookie=1; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    return result;
  } catch {
    return false;
  }
};

/* =========================
   STORAGE HELPERS
========================= */

export const saveTokenInSessionStorage = (token) => {
  sessionStorage.setItem("authToken", token);
};

export const getTokenFromSessionStorage = () => {
  return sessionStorage.getItem("authToken");
};

export const removeTokenFromSessionStorage = () => {
  sessionStorage.removeItem("authToken");
};

/* =========================
   TOKEN VALIDATION
========================= */

export const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);

    if (!decoded?.exp) return false;

    const now = Date.now() / 1000;
    return decoded.exp > now;
  } catch {
    return false;
  }
};

/* =========================
   READ TOKEN
========================= */

export const useReadToken = () => {
  const [cookies] = useCookies(["authToken"]);

  return cookiesEnabled()
    ? cookies.authToken
    : getTokenFromSessionStorage();
};

/* =========================
   AUTH STATE
========================= */

export const useAuth = () => {
  const [cookies, , removeCookie] = useCookies(["authToken"]);

  const token = cookiesEnabled()
    ? cookies.authToken
    : getTokenFromSessionStorage();

  if (!isTokenValid(token)) {
    removeCookie("authToken", { path: "/" });
    removeTokenFromSessionStorage();
    return false;
  }

  return true;
};

/* =========================
   LOGIN
========================= */

export const useLogin = () => {
  const [, setCookie] = useCookies(["authToken"]);
  const navigate = useNavigate();
  const setColumnConfig = useColumnConfig();

  const login = (token) => {
    if (!token) return;

    if (cookiesEnabled()) {
      setCookie("authToken", token, {
        path: "/",
        maxAge: 60 * 60 * 12,
        secure: true,
        sameSite: "lax",
      });
    } else {
      saveTokenInSessionStorage(token);
    }

    setColumnConfig();
    navigate("/homepage");
  };

  return login;
};

/* =========================
   LOGOUT
========================= */

export const useLogout = () => {
  const [, , removeCookie] = useCookies(["authToken"]);
  const navigate = useNavigate();
  const deleteConfig = useDeleteColumnConfig();

  const logout = async () => {
    try {
      removeCookie("authToken", { path: "/" });
      removeTokenFromSessionStorage();

      deleteConfig();

      await signOut();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      navigate("/");
    }
  };

  return logout;
};

/* =========================
   TOKEN DATA SAFE READ
========================= */

export const useTokenInfo = (key) => {
  const token = useReadToken();

  if (!isTokenValid(token)) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded?.[key] ?? null;
  } catch {
    return null;
  }
};

export const useReadCookie = useReadToken;
