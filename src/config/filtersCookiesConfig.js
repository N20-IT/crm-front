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

export const saveTokenInSessionStorage = (filtersConfig) => {
  sessionStorage.setItem("filtersConfig", filtersConfig);
};

export const removeTokenFromSessionStorage = () => {
  sessionStorage.removeItem("filtersConfig");
};

export const getTokenFromSessionStorage = () => {
  return sessionStorage.getItem("filtersConfig");
};

export const useFiltersConfig = () => {
  const [, setCookie] = useCookies(["filtersConfig"]);
  const setConfig = () => {
    cookiesEnabled()
      ? setCookie(
          "filtersConfig",
          {
            ulica: "",
            dzielnica: [],
            poddzielnica: [],
            miasto: "",
            typInwestycji: "",
            rynek: "",
            minIloscPokoi: "",
            maxIloscPokoi: "",
            minMetraz: "",
            maxMetraz: "",
            minPrice: "",
            maxPrice: "",
            agent: "",
            statusOferty: "",
            dataKontaktuOd: "",
            dataKontaktuDo: "",
            dataNastepnegoKontaktuOd: "",
            dataNastepnegoKontaktuDo: "",
            clientId: "",
          },
          { path: "/", maxAge: 60 * 60 * 12 }
        )
      : saveTokenInSessionStorage({});
  };
  return setConfig;
};

export const useDeleteFiltersConfig = () => {
  const [, , removeCookie] = useCookies(["filtersConfig"]);
  const deleteConfig = () => {
    cookiesEnabled()
      ? removeCookie("filtersConfig", { path: "/" })
      : removeTokenFromSessionStorage();
  };
  return deleteConfig;
};

export const useReadFiltersConfig = () => {
  const [cookies] = useCookies(["filtersConfig"]);
  return cookiesEnabled()
    ? cookies.filtersConfig
    : getTokenFromSessionStorage();
};

export const useChangeFiltersConfig = () => {
  const [, setCookie] = useCookies(["filtersConfig"]);
  const setConfig = (filtersConfig) => {
    cookiesEnabled()
      ? setCookie("filtersConfig", filtersConfig, {
          path: "/",
          maxAge: 60 * 60 * 12,
        })
      : saveTokenInSessionStorage(filtersConfig);
  };
  return setConfig;
};
