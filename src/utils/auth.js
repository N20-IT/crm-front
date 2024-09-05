import { useCookies } from "react-cookie";

export const cookiesEnabled = () => {
  try {
    document.cookie = "testcookie=1";
    const result = document.cookie.indexOf("testcookie") !== -1;
    document.cookie = "testcookie=1; expires=Thu, 01 Jan 1970 00:00:00 GMT"; // usuwamy testowe ciasteczko
    return result;
  } catch {
    return false;
  }
};

export const useAuth = () => {
  const [cookies] = useCookies(["authToken"]);
  return cookiesEnabled()
    ? !!cookies.authToken
    : !!getTokenFromSessionStorage();
};

export const useLogin = () => {
  const [, setCookie] = useCookies(["authToken"]);
  const login = (token) => {
    cookiesEnabled()
      ? setCookie("authToken", token, { path: "/", maxAge: 60 * 60 * 24 * 7 })
      : saveTokenInSessionStorage(token);
  };
  return login;
};

export const useLogout = () => {
  const [, , removeCookie] = useCookies(["authToken"]);
  const logout = () => {
    cookiesEnabled()
      ? removeCookie("authToken", { path: "/" })
      : removeTokenFromSessionStorage();
  };
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
