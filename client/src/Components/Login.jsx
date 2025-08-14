import React, { useState } from "react";
import { BASE_URL } from "../utils/constants";
import { ADD_USER } from "../utils/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleLogin = async () => {
    try {
      setError("");
      const response = await fetch(BASE_URL + "/login", {
        method: "POST",
        body: JSON.stringify({ emailId, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }

      localStorage.setItem("token", data.token);
      dispatch(ADD_USER(data.data));
      navigate("/");
    } catch (err) {
      setError("Something went wrong");
      console.error(err);
    }
  };
  return (
    <div className="bg-black/20 rounded-xl w-100 px-15 py-10 pb-15">
      <h1 className="text-white text-2xl text-center">Login</h1>
      <div className="flex flex-col mt-2">
        <div className="flex">
          <label className="text-white" htmlFor="">
            Email
          </label>
        </div>
        <input
          value={emailId}
          onChange={(e) => setEmailId(e.target.value)}
          type="text"
          className="bg-white input input-sm"
          placeholder="Enter email"
        />
        <label className="mt-1 text-white" htmlFor="">
          Password:
        </label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="bg-white input input-sm"
          placeholder="Enter password"
        />
        {error && <p className="text-red-700 mt-1">{error}</p>}
        <button onClick={handleLogin} className="btn mt-3 w-19 btn-sm">
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
