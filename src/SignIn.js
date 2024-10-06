import React, { useState } from "react";
import { signIn, resetPassword, confirmResetPassword } from "@aws-amplify/auth";

function SignIn({ onSignIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const [resetCode, setResetCode] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (resetMode) {
      try {
        await confirmResetPassword({
          username: email,
          confirmationCode: resetCode,
          newPassword: password,
        });
        console.log("Password has been successfully updated.");
        setResetMode(false);
        setError("");
      } catch (error) {
        setError(error.message || "Failed to reset password");
      }
    } else {
      try {
        const user = await signIn({
          username: email,
          password: password,
        });
        onSignIn(user);
      } catch (error) {
        setError(error.message || "An error occurred during sign in");
      }
    }
  };

  const handleForgotPassword = async () => {
    try {
      await resetPassword({ username: email });
      setResetMode(true);
      setError("Please check your email for the reset code.");
    } catch (error) {
      setError(error.message || "Failed to send reset password code");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Emailll:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="button" onClick={togglePasswordVisibility}>
            {showPassword ? "Hide" : "Show"} Password
          </button>
        </label>
        {resetMode && (
          <label>
            Reset Code:
            <input
              type="text"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              required
            />
          </label>
        )}
        <button type="submit">
          {resetMode ? "Reset Password" : "Sign In"}
        </button>
        {!resetMode && (
          <button type="button" onClick={handleForgotPassword}>
            Forgot Password?
          </button>
        )}
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}

export default SignIn;
