import { Button } from "@aws-amplify/ui-react";
import React from "react";
import { useCookies } from "react-cookie";

function LoginPage() {
  const [cookies, setCookies, removeCookie] = useCookies(["authToken"]);

  const checkToken = () => {
    const token = cookies.authToken;
    if (token) console.log("token exists", token);
    else console.log("token doesn't exist");
  };

  const removeToken = () => {
    removeCookie("authToken", { path: "/" });
    console.log("Token został usunięty.");
  };

  return (
    <div>
      <h1 className=" text-3xl font-bold underline"> Login Page</h1>
      <div>
        <Button onClick={checkToken}>check token</Button>
        <Button
          onClick={() => {
            setCookies("authToken", "TokenValue", { path: "/" });
          }}
        >
          {" "}
          Dodaj token
        </Button>
        <Button onClick={removeToken}> usun token</Button>
      </div>
    </div>
  );
}

export default LoginPage;
