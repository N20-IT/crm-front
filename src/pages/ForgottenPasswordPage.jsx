import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import { resetPassword, confirmResetPassword } from "@aws-amplify/auth";
import CustomTextField from "../components/CustomTextField";

function ForgottenPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [stage, setStage] = useState(0); // 0: send code, 1: reset password

  const LambdaConnection = (email, attribute, apiUrl) => {
    var raw = JSON.stringify({
      email: email,
      attribute: attribute,
      value: "false",
    });
    var requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: raw,
      redirect: "follow",
    };

    console.log("Calling Lambda: ", apiUrl);

    return fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("Attribute checked: ", result);

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

  const handleSendCode = async () => {
    try {
      const output = await resetPassword({ username: email });
      if (
        output.nextStep.resetPasswordStep === "CONFIRM_RESET_PASSWORD_WITH_CODE"
      ) {
        setStage(1); // Move to reset password stage
      } else if (output.nextStep.resetPasswordStep === "DONE") {
        console.log("Password reset without need for confirmation code.");
      }
    } catch (error) {
      console.error("Error sending reset code:", error);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword: newPassword,
      });
      console.log("Password successfully reset.");

      const attribute = "custom:forceResetPass";
      const apiUrl =
        "https://adgr2ko5s4.execute-api.eu-north-1.amazonaws.com/dev/change-attribute";

      LambdaConnection(email, attribute, apiUrl);
      navigate("/"); // Navigate to the root after successful password reset
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  return (
    <div
      className="h-screen flex justify-center items-center bg-white bg-cover bg-center font-poppins flex-col"
      style={{ backgroundImage: "url(/real-estate.jpg)" }}
    >
      <div className="absolute max-w-36 top-8 left-28">
        <img src="/n20logoCzarne.png" />
      </div>
      {stage === 0 ? (
        <>
          <div className="relative w-screen max-w-xl h-screen max-h-96 p-8 bg-white rounded-2xl shadow-lg opacity-95 flex flex-col justify-start items-center">
            <h1 className="font-bold text-4xl mb-10 font-poppins">
              Resetuj hasło
            </h1>
            <CustomTextField
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
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
              onClick={handleSendCode}
            >
              Wyślij kod
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="relative w-screen max-w-xl h-screen max-h-96 p-8 bg-white rounded-2xl shadow-lg opacity-95 flex flex-col justify-start items-center">
            <CustomTextField
              label="Code"
              variant="outlined"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              fullWidth
            />
            <CustomTextField
              label="New Password"
              type="password"
              variant="outlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              sx={{ marginTop: "24px" }}
            />
            <CustomTextField
              label="Confirm New Password"
              type="password"
              variant="outlined"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              fullWidth
              sx={{ marginTop: "24px" }}
            />
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
              onClick={handleResetPassword}
            >
              Reset Password
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default ForgottenPasswordPage;
