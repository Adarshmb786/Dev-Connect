import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { ADD_USER } from "../utils/userSlice";
import { contextData } from "../Context/ContextDataa";
const Body = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);

  const checkUserLogin = async () => {
    try {
      if (!user) return;
      const response = await fetch(BASE_URL + "/checklogin", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return navigate("/start");
      }
      dispatch(ADD_USER(data.data));
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    checkUserLogin();
  }, []);
  return (
    <contextData.Provider value={checkUserLogin}>
      <div className="pb-20 min-h-[100vh] bg-gradient-to-r from-[#4e3ec9] via-[#8c5cfb] to-[#d96bed]">
        <Navbar />
        <Outlet />
      </div>
    </contextData.Provider>
  );
};

export default Body;
