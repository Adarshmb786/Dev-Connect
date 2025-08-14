import React from "react";
import logo from "../assets/images/logo.png";
import { Outlet } from "react-router-dom";

const LandingPage = () => {
  return (
    <div>
      <div className="flex justify-center flex-col items-center">
        <h1 className="text-blue-300 text-4xl font-bold">
          Welcome to DEV CONNECT
        </h1>
        <h2 className="text-blue-300 text-2xl mt-2">
          Your Developer Network Awaits
        </h2>
        <h3 className="text-blue-300">
          Connect, Chat, and Create something massive.
        </h3>
      </div>
      <div className="flex justify-between p-10 h-110">
        <div className="w-1/2 flex justify-center items-center">
          <img src={logo} className="w-100 h-100" alt="" />
        </div>
        <div className="w-1/2 flex justify-center items-center">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
