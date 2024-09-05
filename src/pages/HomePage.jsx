import React from "react";
import { useLogout } from "../utils/auth";
import { Button } from "@aws-amplify/ui-react";
//TODO
function HomePage() {
  return (
    <div>
      <h1>Hello</h1>
      <Button onClick={useLogout()}>wyloguj sie</Button>
    </div>
  );
}

export default HomePage;
