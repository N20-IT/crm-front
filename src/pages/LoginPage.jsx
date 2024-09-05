import { Button } from "@aws-amplify/ui-react";
import React from "react";
import { useCookies } from "react-cookie";
import { useLogin, useLogout } from "../utils/auth";

function LoginPage() {
  const [cookies] = useCookies(["authToken"]);
  const login = useLogin();

  const checkToken = () => {
    const token = cookies.authToken;
    if (token) console.log("token exists", token);
    else console.log("token doesn't exist");
  };
  const addToken = () => {
    const token = "exampleToken";
    login(token);
    console.log("Token has been added.");
  };

  return (
    <div>
      <h1 className=" text-3xl font-bold underline"> Login Page</h1>
      <div>
        <Button onClick={checkToken}>check token</Button>
        <Button onClick={addToken}> Dodaj token</Button>
        <Button onClick={useLogout}> usun token</Button>
      </div>
    </div>
  );
}

export default LoginPage;
