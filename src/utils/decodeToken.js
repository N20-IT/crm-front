import { jwtDecode } from "jwt-decode";
import { useReadCookie } from "../utils/auth";

export const GetInformationFromToken = (info) => {
  const token = useReadCookie();
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken[info];
  } catch (error) {
    console.error("Błąd dekodowania tokena:", error.message);
    return null;
  }
};
