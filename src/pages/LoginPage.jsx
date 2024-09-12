import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Alert,
  Snackbar,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { signIn, fetchAuthSession } from "@aws-amplify/auth";
import { Amplify } from "aws-amplify";
import awsExports from "../aws-exports";
import { useLogin, useAuth } from "../utils/auth";
import { useNavigate } from "react-router-dom";
Amplify.configure(awsExports);

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = useAuth();
  const login = useLogin();

  useEffect(() => {
    if (isAuthenticated) navigate("/homepage");
  }, [isAuthenticated, navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await signIn({
        username: username,
        password: password,
      });
      setError("");
      setOpen(false);
      login(await handleLogJwtToken());
    } catch (error) {
      setError(error.message || "An error occurred during sign in");
      setOpen(true);
    }
  };

  const handleLogJwtToken = async () => {
    try {
      const session = await fetchAuthSession();
      return session.tokens.accessToken.toString();
    } catch (error) {
      setError("Error fetching auth session:", error);
      setOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleForgottenPassword = () => {
    setError("Zapomnialem hasla");
    setOpen(true);
    console.log(username, password);
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
      {error && (
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleClose}
            variant="filled"
            severity="error"
            sx={{ width: "100%", fontSize: "20px", fontFamily: "Poppins" }}
          >
            {error}
          </Alert>
        </Snackbar>
      )}
    </div>
  );
}

export default LoginPage;
