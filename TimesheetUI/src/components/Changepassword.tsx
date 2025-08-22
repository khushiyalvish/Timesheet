import React, { useState } from "react";
import API from "../api/axios";
import "../styles/ChangePassword.css";
import { toast } from "react-toastify"; 


interface ChangePasswordProps {
  onClose: () => void;
}


const ChangePassword: React.FC<ChangePasswordProps> = ({ onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (newPassword !== confirmPassword) {
     toast.error("New password and confirm password do not match");
    return;
  }

  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        toast.error("Not authenticated. Please log in again.");
      return;
    }

    await API.post(
      "/auth/changepassword",
      {
        oldPassword,
        newPassword
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

     
    toast.success("Password changed successfully");
    onClose();
  } catch (error: any) {
    console.error("Change password failed", error);
    // show server message if available
    const msg = error?.response?.data?.message ?? "Failed to change password";
    toast.error(msg);
  }

};
  return (
    <div className="change-password-modal">
      <div className="change-password-content">
        <h2>Change Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <div className="actions">
            <button type="submit">Submit</button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
