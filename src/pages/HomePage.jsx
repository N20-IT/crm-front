import React from "react";
import { useLogout } from "../utils/auth";
import { Button } from "@mui/material"; //TODO
function HomePage() {
  return (
    <div>
      <h1>Hello</h1>
      <Button onClick={useLogout()}>wyloguj sie</Button>
    </div>
  );
}

export default HomePage;
