import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";

const Requests = () => {
  const { token } = useSelector((store) => store.user);
  const [requests, setRequests] = useState([]);

  const fetchConnections = async () => {
    try {
      const response = await fetch(BASE_URL + "/user/requests", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        setRequests([]);
        return console.log(data.message);
      }
      setRequests(data.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchConnections();
  }, []);

  const handleAccept = async (id) => {
    try {
      const response = await fetch(
        BASE_URL + "/request/review/accepted/" + id,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        console.log(data.message);
      }
      fetchConnections();
    } catch (err) {
      console.log(err);
    }
  };
  const handleReject = async (id) => {
    try {
      const response = await fetch(
        BASE_URL + "/request/review/rejected/" + id,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        console.log(data.message);
      }
      fetchConnections();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center flex-col items-center">
      <h1 className="flex items-center gap-2 text-white text-2xl font-mono font-semibold uppercase px-6 py-3 rounded-2xl backdrop-blur-md bg-white/10 shadow-xl border border-white/20 w-fit">
        <span>🤝</span>People Who Want to Connect
      </h1>

      {requests.length !== 0 ? (
        requests.map((user) => (
          <div
            key={user._id}
            className="w-100 py-2 border-4 border-purple-800/20 bg-purple-200 mt-3 flex justify-between items-center"
          >
            <div className="flex items-center">
              <img
                className="rounded-full ml-4 w-16 h-16"
                src={`${BASE_URL}/uploads/profilePicture/${user.senderId.profilePic}`}
                alt=""
              />
              <h1 className="font-bold ml-3 text-sm">
                {user.senderId.firstName} {user.senderId.lastName}
              </h1>
            </div>

            <div>
              <button
                onClick={() => handleAccept(user.senderId._id)}
                className="btn mr-2 bg-blue-700 hover:bg-blue-800 border-0 rounded-full text-white"
              >
                Accept
              </button>
              <button
                onClick={() => handleReject(user.senderId._id)}
                className="btn mr-4 bg-blue-800 hover:bg-blue-700 border-0 rounded-full text-white"
              >
                Reject
              </button>
            </div>
          </div>
        ))
      ) : (
        <div>
          <h1 className="font-mono text-xl mt-5">
            No new requests found. <i className="fas fa-face-sad-tear"></i>
          </h1>
        </div>
      )}
    </div>
  );
};

export default Requests;
