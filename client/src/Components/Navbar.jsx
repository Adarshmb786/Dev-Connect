import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { REMOVE_USER } from "../utils/userSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const handleLogout = () => {
    dispatch(REMOVE_USER());
    localStorage.removeItem("token");
    navigate("/start");
  };

  return (
    <div className="flex justify-between p-4">
      <h1
        onClick={() => navigate("/")}
        className="text-2xl font-bold text-blue-400 cursor-pointer"
      >
        DEV CONNECT
      </h1>
      <div className="flex gap-2">
        {!user?.token ? (
          <>
            <button
              onClick={() => navigate("/start")}
              className="btn btn-primary btn-sm"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/start/signup")}
              className="btn btn-primary btn-sm"
            >
              Signup
            </button>
          </>
        ) : (
          <>
            <ul className="flex gap-2 cursor-pointer mt-[2px] text-white">
              <li className="hover:text-black">
                <Link to="/">Home</Link>
              </li>
              <li className="hover:text-black">
                <a href="/connections">Connections</a>
              </li>
              <li className="hover:text-black">
                <Link to="/requests">Requests</Link>
              </li>

              <li className="hover:text-black">
                <Link to="/profile">Profile</Link>
              </li>
              <div className="dropdown dropdown-hover dropdown-left">
                <li className="hover:text-black">Settings</li>
                <ul
                  tabIndex={0}
                  className="dropdown-content text-black menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                >
                  <li>
                    <Link to="/editprofile">Edit Profile</Link>
                  </li>
                  <li>
                    <Link to="/updatepassword">Change Password</Link>
                  </li>
                </ul>
              </div>
            </ul>
            <button onClick={handleLogout} className="btn btn-primary btn-sm">
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
