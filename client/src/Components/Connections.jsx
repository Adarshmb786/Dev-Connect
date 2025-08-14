import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const Connections = () => {
  const navigate = useNavigate();
  const { token } = useSelector((store) => store.user);
  const [connectionsToShow, setConnectionsToShow] = useState([]);
  const [allConnections, setAllConnections] = useState([]);
  const [heading, setHeading] = useState(false);
  const fetchConnections = async () => {
    try {
      const response = await fetch(BASE_URL + "/user/connections", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return console.log(data.message);
      }
      setAllConnections(data.data);
      setConnectionsToShow(data.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchConnections();
  }, []);

  const handleSearch = (value) => {
    if (value === "") {
      setConnectionsToShow(allConnections);
    } else {
      const regex = new RegExp("^" + value, "i");
      const filteredData = allConnections.filter((item) => {
        const userName = item.firstName + " " + item.lastName;

        return regex.test(userName);
      });
      setConnectionsToShow(filteredData);
      setHeading(true);
    }
  };
  return (
    <div className="flex justify-center flex-col items-center">
      <h1 className="flex items-center gap-2 text-white text-2xl font-mono font-semibold uppercase px-6 py-3 rounded-2xl backdrop-blur-md bg-white/10 shadow-xl border border-white/20 w-fit">
        <span>🤝</span>YOUR CONNECTIONS
      </h1>
      {connectionsToShow.length !== 0 ? (
        <div className="flex flex-wrap justify-center mt-5 gap-2 w-240">
          {connectionsToShow.map((user) => (
            <div
              key={user._id}
              className="w-50 bg-purple-400/40 hover:bg-purple-400/30 py-6 rounded-2xl flex justify-center flex-col items-center"
            >
              <img
                className="w-40 h-50 rounded-2xl object-cover"
                src={`${BASE_URL}/uploads/profilePicture/${user.profilePic}`}
                alt=""
              />
              <h1 className="text-white font-mono mt-1">
                {user.firstName} {user.lastName}
              </h1>
              <button
                onClick={() => navigate("/viewprofile/" + user._id)}
                className="btn text-white bg-blue-900/50 hover:bg-blue-900/80 border-0 btn-xs  px-5 mt-1"
              >
                View Profile
              </button>
              <button
                onClick={() => navigate("/connections/inbox/" + user._id)}
                className="btn text-white bg-blue-900/50 hover:bg-blue-900/80 border-0 btn-xs  px-5 mt-1"
              >
                Chat
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h1 className="font-mono text-xl mt-5">
            {!heading ? "No Connections." : "No user found."}{" "}
            <i className="fas fa-face-sad-tear"></i>
          </h1>
        </div>
      )}

      <div className="absolute top-19 left-330">
        <input
          onChange={(e) => handleSearch(e.target.value)}
          type="text"
          className="bg-white input input-sm border-4 border-purple-500 rounded-2xl"
          placeholder="Search friends here..."
        />
      </div>
    </div>
  );
};

export default Connections;
