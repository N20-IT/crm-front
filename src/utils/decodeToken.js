import { jwtDecode } from "jwt-decode";
import { useReadCookie } from "../utils/auth";

export const GetUserRoleFromToken = () => {
  const token = useReadCookie();
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken["custom:role"];
  } catch (error) {
    console.error("Błąd dekodowania tokena:", error.message);
    return null;
  }
};
