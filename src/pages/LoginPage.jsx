import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import React, { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { signIn, fetchAuthSession } from "@aws-amplify/auth";
import { Amplify } from "aws-amplify";
import awsExports from "../aws-exports";
import { useLogin } from "../utils/auth";
import Alerts from "../components/Alerts";
Amplify.configure(awsExports);

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");
  const [alertOpen, setAlertOpen] = useState(false);
  const login = useLogin();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await signIn({
        username: username,
        password: password,
      });
      login(await handleLogJwtToken());
    } catch (error) {
      setAlertOpen(true);
      setAlertMessage(error.message || "An error occurred during sign in");
      setAlertSeverity("error");
    }
  };

  const handleLogJwtToken = async () => {
    try {
      const session = await fetchAuthSession();
      return session.tokens.accessToken.toString();
    } catch (error) {
      setAlertOpen(true);
      setAlertMessage("Error fetching auth session:", error);
      setAlertSeverity("error");
    }
  };
  const handleForgottenPassword = () => {
    setAlertMessage("Forgotten password!");
    setAlertSeverity("info");
    setAlertOpen(true);
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <div
      className=" h-screen flex justify-center items-center bg-white bg-cover bg-center font-poppins flex-col"
      style={{ backgroundImage: "url('/real-estate.jpg')" }}
    >
      <div className="absolute max-w-36 top-8 left-28">
        <img src="/n20logoCzarne.png" />
      </div>
      <div className="relative w-screen max-w-xl h-screen max-h-126 p-8 bg-white rounded-2xl shadow-lg opacity-95 flex flex-col justify-start items-center">
        <TextField
          autoComplete="email"
          fullWidth
          label="Nazwa użytkownika"
          id="username"
          onChange={(e) => setUsername(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              fontFamily: "Poppins",
              fontSize: "20px",
            },
            "& .MuiFormLabel-root": {
              fontFamily: "Poppins",
              fontSize: "20px",
              color: "#535968",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#535968",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#535968",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#535968",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#535968",
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#535968",
            },

            marginTop: "50px",
          }}
        />
        <FormControl
          sx={{ width: "512px", marginTop: "24px" }}
          variant="outlined"
        >
          <InputLabel
            htmlFor="outlined-adornment-password"
            sx={{
              fontFamily: "Poppins",
              fontSize: "20px",
              color: "#535968",
              "&.Mui-focused": {
                color: "#535968",
              },
            }}
          >
            Password
          </InputLabel>
          <OutlinedInput
            sx={{
              borderRadius: "12px",
              fontFamily: "Poppins",
              fontSize: "20px",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#535968",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#535968",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#535968",
              },
            }}
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <Button
          fullWidth
          sx={{
            height: "64px",
            backgroundColor: "#FC8721",
            borderRadius: "32px",
            color: "white",
            fontFamily: "Poppins",
            fontSize: "20px",
            marginTop: "24px",
          }}
          className=" mt-6"
          onClick={handleLogin}
        >
          {" "}
          Log in
        </Button>

        <Button
          variant="text"
          sx={{
            color: "#272F3E",
            textDecoration: "underline",
            height: "30px",
            position: "absolute",
            bottom: "32px",
            fontFamily: "Poppins",
            fontSize: "20px",
          }}
          onClick={handleForgottenPassword}
        >
          Zapomniałem hasła
        </Button>
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

export default LoginPage;
