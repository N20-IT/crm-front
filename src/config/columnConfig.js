import { useCookies } from "react-cookie";

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

export const saveTokenInSessionStorage = (columnConfig) => {
  sessionStorage.setItem("columnConfig", columnConfig);
};

export const removeTokenFromSessionStorage = () => {
  sessionStorage.removeItem("columnConfig");
};

export const getTokenFromSessionStorage = () => {
  return sessionStorage.getItem("columnConfig");
};

export const useColumnConfig = () => {
  const [, setCookie] = useCookies(["columnConfig"]);
  const setConfig = () => {
    cookiesEnabled()
      ? setCookie("columnConfig", "0", { path: "/", maxAge: 60 * 60 * 12 })
      : saveTokenInSessionStorage("0");
  };
  return setConfig;
};

export const useDeleteColumnConfig = () => {
  const [, , removeCookie] = useCookies(["columnConfig"]);
  const deleteConfig = () => {
    cookiesEnabled()
      ? removeCookie("columnConfig", { path: "/" })
      : removeTokenFromSessionStorage();
  };
  return deleteConfig;
};

export const useReadConfig = () => {
  const [cookies] = useCookies(["columnConfig"]);
  return cookiesEnabled() ? cookies.columnConfig : getTokenFromSessionStorage();
};

export const useChangeColumnConfig = () => {
  const [, setCookie] = useCookies(["columnConfig"]);
  const setConfig = (columnConfig) => {
    // console.log(columnConfig);
    cookiesEnabled()
      ? setCookie("columnConfig", columnConfig, {
          path: "/",
          maxAge: 60 * 60 * 12,
        })
      : saveTokenInSessionStorage(columnConfig);
  };
  return setConfig;
};
