import React, { useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";
import { useDelayedNavigate } from "../Custom Hooks/useDelayedNavigate";
import LoadingEffect from "./LoadingEffect";
import { useNavigate } from "react-router-dom";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const { token } = useSelector((store) => store.user);
  const delayedNavigate = useDelayedNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loadEffect, setLoadEffect] = useState(false);
  const handleUpdate = async () => {
    try {
      if (!token) return;
      setError("");
      if (!currentPassword || !newPassword || !confirmPassword) {
        return setError("Enter properly.");
      }
      if (newPassword !== confirmPassword) {
        return setError("New password and confirm password should be same.");
      }
      const response = await fetch(BASE_URL + "/updatepassword", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        return setError(data.message || "Something went wrong.");
      }
      delayedNavigate(setLoadEffect, "/");
    } catch (err) {
      console.log(err);
    }
  };
  if (!token) return;
  if (loadEffect) {
    return <LoadingEffect />;
  }
  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center w-100 bg-blue-100/10 p-10 mt-10 backdrop-blur-md bg-white/10 shadow-xl border border-white/20">
        <h1 className="text-2xl text-white">Change Password</h1>
        <div className="w-[100%] mt-4">
          <label htmlFor="">Current Password</label>
          <input
            onChange={(e) => setCurrentPassword(e.target.value)}
            value={currentPassword}
            className="input w-[100%] input-sm mt-1"
            type="password"
            placeholder="Enter your current password"
          />
        </div>
        <div className="w-[100%] mt-2">
          <label htmlFor="">New Password</label>
          <input
            onChange={(e) => setNewPassword(e.target.value)}
            value={newPassword}
            className="input w-[100%] mt-1 input-sm"
            type="password"
            placeholder="Enter your new password"
          />
        </div>
        <div className="w-[100%] mt-2">
          <label htmlFor="">Confirm New Password</label>
          <input
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            className="input w-[100%] mt-1 input-sm"
            type="password"
            placeholder="Enter your new password again"
          />
        </div>
        {error && <p className="text-red-600 w-[100%]">{error}</p>}
        <button
          onClick={handleUpdate}
          className="btn bg-blue-700 hover:bg-blue-600 border-0 mt-5 btn-sm text-white"
        >
          Update
        </button>
        <button
          onClick={() => navigate("/")}
          className="btn bg-blue-800 hover:bg-blue-700 border-0 mt-1 btn-sm text-white "
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UpdatePassword;
