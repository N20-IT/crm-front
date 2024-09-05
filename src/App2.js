import React, { useState, useEffect } from "react";
import { getCurrentUser, signOut, fetchAuthSession } from "@aws-amplify/auth";
import SignIn from "./SignIn"; // Ensure SignIn handles sign-in with @aws-amplify/auth
import "./styles.css";
// import { Amplify } from "aws-amplify";
// import awsExports from "./aws-exports";
// Amplify.configure(awsExports);

function App2() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Error checking current user:", error);
      setUser(null);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleLogJwtToken = async () => {
    try {
      const session = await fetchAuthSession();
      console.log(session.tokens.accessToken.toString()); // Log the encoded Access token
    } catch (error) {
      console.error("Error fetching auth session:", error);
    }
  };

  return (
    <div className="App">
      {user ? (
        <>
          <h1>Welcome, {user.username}</h1>
          <button onClick={handleSignOut}>Log Out</button>
          <button onClick={handleLogJwtToken}>Log JWT Token</button>
        </>
      ) : (
        <SignIn onSignIn={setUser} />
      )}
    </div>
  );
}

export default App2;
