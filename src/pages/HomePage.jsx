import React, { useState, useEffect } from "react";
import { useLogout } from "../utils/auth";
import { Button } from "@mui/material";
import Alerts from "../components/Alerts";
import { useReadCookie } from "../utils/auth";
import axios from "axios";
import { waitFor } from "@testing-library/react";
//TODO
function HomePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");
  const [alertOpen, setAlertOpen] = useState(false);
  const token = useReadCookie();
  const logout = useLogout();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://193.164.254.242:3020/listings",
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(response.data);
        console.log(response.data);
        setLoading(false);
      } catch (error) {
        setAlertOpen(true);
        setAlertMessage(error.message);
        setAlertSeverity("error");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Hello</h1>
      <Button
        onClick={logout}
        sx={{ backgroundColor: "black", color: "white", borderRadius: "16px" }}
      >
        wyloguj sie
      </Button>
      <div className="flex items-center justify-center flex-col">
        <h1 className=" font-medium text-3xl">dane z api</h1>
        <ul className="flex items-center justify-center flex-col">
          {Array.isArray(data) ? (
            data.map((item) => <li key={item._id}>{item.agent}</li>)
          ) : (
            <li>Brak danych do wyświetlenia</li>
          )}
        </ul>
      </div>
      <Alerts
        message={alertMessage}
        severity={alertSeverity}
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
      />
    </div>
  );
}

export default HomePage;
