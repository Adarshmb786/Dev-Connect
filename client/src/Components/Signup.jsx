import React, { useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { ADD_USER } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const handleSignup = async () => {
    try {
      setError("");
      if (!firstName || !lastName || !emailId || !password || !confirmPass) {
        return setError("Enter properly.");
      }
      if (password !== confirmPass) {
        return setError("Password and Confirm Password not match.");
      }
      const response = await fetch(BASE_URL + "/signup", {
        method: "POST",
        body: JSON.stringify({
          firstName,
          lastName,
          emailId,
          password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return setError(data.message);
      }
      localStorage.setItem("token", data.token);
      dispatch(ADD_USER(data.data));
      navigate("/editprofile");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="bg-black/20 rounded-xl mt-10 py-10 w-100 px-15">
      <h1 className="text-white text-2xl text-center">Signup</h1>
      <div className="flex flex-col">
        <label className="text-white" htmlFor="">
          First Name
        </label>
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          type="text"
          className="bg-white input input-sm"
          placeholder="Enter firstname"
        />
        <label className="text-white" htmlFor="">
          Last Name
        </label>
        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          type="text"
          className="bg-white input input-sm"
          placeholder="Enter lastname"
        />
        <label className="text-white" htmlFor="">
          Email
        </label>
        <input
          value={emailId}
          onChange={(e) => setEmailId(e.target.value)}
          type="text"
          className="bg-white input input-sm"
          placeholder="Enter email"
        />
        <label className=" text-white" htmlFor="">
          Password:
        </label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="bg-white input input-sm"
          placeholder="Enter password"
        />
        <label className="text-white" htmlFor="">
          Confirm Password
        </label>
        <input
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
          type="password"
          className="bg-white input input-sm"
          placeholder="Enter confirm password"
        />
        {error && <p className="text-red-700 mt-1">{error}</p>}
        <button onClick={handleSignup} className="btn mt-3 w-19 btn-sm">
          Signup
        </button>
      </div>
    </div>
  );
};

export default Signup;
