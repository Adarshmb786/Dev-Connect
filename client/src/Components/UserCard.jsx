import React from "react";
import { BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserCard = ({ user, profilePage, fetchUsers, connectionViewProfile }) => {
  const navigate = useNavigate();
  const token = useSelector((store) => store.user.token);
  const handleSendRequest = async () => {
    try {
      const response = await fetch(
        BASE_URL + "/request/send/interested/" + user._id,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return console.log(data.message);
      }
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const handleIgnore = async () => {
    try {
      const response = await fetch(
        BASE_URL + "/request/send/ignored/" + user._id,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return console.log(data.message);
      }
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  if (!user) return;
  return (
    <div className="flex justify-between">
      <div className="w-1/2 flex justify-end">
        <img
          src={`${BASE_URL}/uploads/profilePicture/${user.profilePic}`}
          className="max-w-130 h-140 rounded-4xl"
        />
      </div>
      <div className="w-1/2 flex flex-col">
        <div className="ml-10 w-100 h-128 overflow-auto text-white">
          <div className="flex">
            <h1 className="text-2xl mt-3">
              {user.firstName} {user.lastName}
            </h1>
            {profilePage && (
              <button
                onClick={() => navigate("/editprofile")}
                className="ml-2 cursor-pointer text-black"
              >
                Edit <i className="fa-solid fa-pen-to-square"></i>
              </button>
            )}
          </div>
          {user.gender && user.age && (
            <h3>
              {user.gender}, {user.age}
            </h3>
          )}
          {user.description && (
            <p className="mt-2">
              <span className="text-black font-semibold">About : </span>
              {user.description}
            </p>
          )}
          {user.skills.length > 0 && (
            <p className="mt-3">
              <span className="text-black font-semibold">Skills : </span>
              {user.skills.map((skill, index) => (
                <span key={index}>
                  {user.skills.length - 1 !== index ? `${skill}, ` : skill}
                </span>
              ))}
            </p>
          )}
        </div>
        {!profilePage && !connectionViewProfile && (
          <div className="ml-10 mt-1">
            <button
              onClick={handleIgnore}
              className="btn rounded-2xl bg-blue-600 hover:bg-blue-700 text-white border-0"
            >
              Ignore
            </button>
            <button
              onClick={handleSendRequest}
              className="btn ml-3 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white border-0"
            >
              Send connection request
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
