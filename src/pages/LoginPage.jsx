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
import { signIn, confirmSignIn, fetchAuthSession } from "@aws-amplify/auth";
import { Amplify } from "aws-amplify";
import awsExports from "../aws-exports";
import { useLogin, useAuth } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import LoadingCircularProgress from "../components/LoadingCircularProgress";
import { useCookies } from "react-cookie";
import { removeTokenFromSessionStorage } from "../utils/auth";
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
  const [loading, setLoading] = useState(false);
  const [, , removeCookie] = useCookies(["authToken"]);

  useEffect(() => {
    removeCookie("authToken", { path: "/" });
    removeTokenFromSessionStorage();
  }, [removeCookie]);

  useEffect(() => {
    if (isAuthenticated) navigate("/oferty");
  }, [isAuthenticated, navigate]);

  const LambdaConnection = (email, attribute, apiUrl) => {
    var raw = JSON.stringify({
      email: email,
      attribute: attribute,
    });
    var requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: raw,
      redirect: "follow",
    };

    // console.log("Calling Lambda: ", apiUrl);

    return fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log("Attribute checked: ", result);

        let cleanedBody = result.body.replace(/"/g, "");

        if (cleanedBody === "true") {
          return true;
        }

        return false; // Return the entire result if it's not 'true'
      })
      .catch((error) => {
        console.log("error", error);
        throw error; // It's good practice to re-throw the error so it can be handled further up the chain if needed
      });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const user = await signIn({ username, password });

      if (
        user?.nextStep?.signInStep ===
        "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
      ) {
        const newPassword = prompt("Enter new password:");
        await confirmSignIn(user, newPassword);
      }

      const attribute = "custom:forceResetPass";
      const url =
        "https://adgr2ko5s4.execute-api.eu-north-1.amazonaws.com/dev/check-attribute";
      const requirePasswordChange = await LambdaConnection(
        username,
        attribute,
        url,
      );

      if (requirePasswordChange === true) {
        navigate("/zapomniane-haslo");
        return;
      }

      const session = await fetchAuthSession({ forceRefresh: true });
      const idToken = session.tokens.idToken.toString();

      login(idToken);
      setError("");
      setOpen(false);
    } catch (error) {
      console.error(error);
      setError(error.message || "Login error");
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogJwtToken = async () => {
    try {
      const session = await fetchAuthSession();
      console.log(session);
      return session.tokens.idToken.toString();
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
    // console.log(username, password);
    navigate("/zapomniane-haslo");
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <div
      className="h-screen flex justify-center items-center bg-white bg-cover bg-center font-poppins flex-col"
      style={{ backgroundImage: "url('/real-estate.jpg')" }}
    >
      {loading && <LoadingCircularProgress />}
      <div className="absolute top-36 w-48 h-48 flex items-center justify-center">
        <img src="/n20logoCzarne.png" />
      </div>
      <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg flex flex-col items-center">
        <TextField
          autoComplete="email"
          fullWidth
          label="Nazwa użytkownika"
          id="username"
          onChange={(e) => setUsername(e.target.value)}
          sx={{
            mt: 2,
            "& .MuiOutlinedInput-root": {
              height: "56px",
              borderRadius: "4px",
              fontFamily: "Poppins",
              fontSize: "18px",
            },
            "& .MuiFormLabel-root": {
              fontFamily: "Poppins",
              fontSize: "18px",
              color: "#535968",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#535968",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#535968",
            },
          }}
        />

        <FormControl
          fullWidth
          variant="outlined"
          sx={{ mt: 2 }}
        >
          <InputLabel
            htmlFor="outlined-adornment-password"
            sx={{
              fontFamily: "Poppins",
              fontSize: "18px",
              color: "#535968",
              "&.Mui-focused": {
                color: "#535968",
              },
            }}
          >
            Hasło
          </InputLabel>

          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            label="Hasło"
            sx={{
              height: "56px",
              borderRadius: "4px",
              fontFamily: "Poppins",
              fontSize: "18px",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#535968",
              },
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            height: "56px",
            backgroundColor: "#FC8721",
            fontFamily: "Poppins",
            fontSize: "18px",
            borderRadius: "4px",
          }}
          onClick={handleLogin}
        >
          Zaloguj
        </Button>

        <Button
          variant="text"
          fullWidth
          sx={{
            mt: 1,
            height: "56px",
            color: "#9CA3AF",
            fontFamily: "Poppins",
            fontSize: "18px",
            borderRadius: "4px",
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
