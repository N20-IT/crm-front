import { useCookies } from "react-cookie";
export const useAuth = () => {
  const [cookies] = useCookies("authToken");
  return !!cookies.authToken;
};

export const useLogin = () => {
  const [, setCookie] = useCookies(["authToken"]);
  const login = (token) => {
    setCookie("authToken", token, { path: "/", expires: 7 });
  };
  return login;
};

export const useLogout = () => {
  const [, , removeCookie] = useCookies(["authToken"]);
  const logout = () => {
    removeCookie("authToken", { path: "/" });
  };
  return logout;
};
