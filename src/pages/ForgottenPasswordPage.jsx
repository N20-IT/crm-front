import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button } from '@mui/material';
import { resetPassword, confirmResetPassword } from '@aws-amplify/auth';

function ForgottenPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [stage, setStage] = useState(0); // 0: send code, 1: reset password

  const handleSendCode = async () => {
    try {
      const output = await resetPassword({ username: email });
      if (output.nextStep.resetPasswordStep === 'CONFIRM_RESET_PASSWORD_WITH_CODE') {
        setStage(1); // Move to reset password stage
      } else if (output.nextStep.resetPasswordStep === 'DONE') {
        console.log('Password reset without need for confirmation code.');
      }
    } catch (error) {
      console.error('Error sending reset code:', error);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword: newPassword,
      });
      console.log('Password successfully reset.');
      navigate('/'); // Navigate to the root after successful password reset
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="font-bold text-5xl mb-4">Forgot Password</h1>
      {stage === 0 ? (
        <>
          <TextField
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <Button onClick={handleSendCode}>Send Code</Button>
        </>
      ) : (
        <>
          <TextField
            label="Code"
            variant="outlined"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            fullWidth
          />
          <TextField
            label="New Password"
            type="password"
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
          />
          <TextField
            label="Confirm New Password"
            type="password"
            variant="outlined"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            fullWidth
          />
          <Button onClick={handleResetPassword}>Reset Password</Button>
        </>
      )}
    </div>
  );
}

export default ForgottenPasswordPage;
