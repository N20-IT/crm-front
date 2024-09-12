import React, { useState, useEffect } from "react";
import { useLogout } from "../utils/auth";
import { Button, Skeleton, List, ListItem } from "@mui/material";
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
        const response = await axios.get("/listings", {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
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
        <List>
          {loading ? (
            <>
              <ListItem>
                <Skeleton variant="rectangular" width={210} height={60} />
              </ListItem>
              <ListItem>
                <Skeleton variant="rectangular" width={210} height={60} />
              </ListItem>
            </>
          ) : Array.isArray(data) && data.length > 0 ? (
            data.map((item) => <ListItem key={item._id}>{item.gmina}</ListItem>)
          ) : (
            <ListItem>Brak danych do wyświetlenia</ListItem>
          )}
        </List>
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
