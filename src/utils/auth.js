import { useCookies } from "react-cookie";
import { signOut } from "@aws-amplify/auth";
import { useNavigate } from "react-router-dom";

export const cookiesEnabled = () => {
  try {
    document.cookie = "testcookie=1";
    const result = document.cookie.indexOf("testcookie") !== -1;
    document.cookie = "testcookie=1; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    return result;
  } catch {
    return false;
  }
};

const handleSignOut = async () => {
  try {
    await signOut();
  } catch (error) {
    console.log("Error signing out:", error);
  }
};

export const useAuth = () => {
  const [cookies] = useCookies(["authToken"]);
  return cookiesEnabled()
    ? !!cookies.authToken
    : !!getTokenFromSessionStorage();
};

export const useReadCookie = () => {
  const [cookies] = useCookies(["authToken"]);
  return cookiesEnabled() ? cookies.authToken : getTokenFromSessionStorage();
};

export const useLogin = () => {
  const [, setCookie] = useCookies(["authToken"]);
  const navigate = useNavigate();
  const login = (token) => {
    cookiesEnabled()
      ? setCookie("authToken", token, { path: "/", maxAge: 60 * 60 })
      : saveTokenInSessionStorage(token);
  };
  if (useAuth()) navigate("/homepage");

  return login;
};

export const useLogout = () => {
  const [, , removeCookie] = useCookies(["authToken"]);
  const navigate = useNavigate();
  const logout = () => {
    cookiesEnabled()
      ? removeCookie("authToken", { path: "/" })
      : removeTokenFromSessionStorage();
  };
  handleSignOut();
  if (!useAuth()) navigate("/");
  return logout;
};

export const saveTokenInSessionStorage = (token) => {
  sessionStorage.setItem("authToken", token);
};

export const getTokenFromSessionStorage = () => {
  return sessionStorage.getItem("authToken");
};

export const removeTokenFromSessionStorage = () => {
  sessionStorage.removeItem("authToken");
};
