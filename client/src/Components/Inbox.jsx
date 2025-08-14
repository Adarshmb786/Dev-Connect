import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";
import { createSocketConnection } from "../utils/socket";
import chatLogo from "../assets/images/chat.png";

const Inbox = () => {
  const { id } = useParams();
  const { token, userDetails } = useSelector((store) => store.user);
  const [userProfile, setUserProfile] = useState(null);
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const chatDivRef = useRef(null);
  const fetchUser = async () => {
    try {
      const response = await fetch(
        BASE_URL + "/profile/connection/viewprofile/" + id,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return console.log(data.message);
      }
      setUserProfile(data.data);
    } catch (err) {
      console.log(err);
    }
  };
  const getAllMessages = async () => {
    try {
      const response = await fetch(BASE_URL + "/chat/allmessages/" + id, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        return console.log(data.message);
      }

      setAllMessages(data.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getAllMessages();
  }, []);
  useEffect(() => {
    fetchUser();
    if (!userDetails) return;
    const socket = createSocketConnection();
    socket.emit("joinChat", { userId: userDetails._id, receiverId: id });
    socket.on(
      "messageReceived",
      ({ userId, fullName, profilePic, message, time, fullDate }) => {
        setAllMessages((prev) => [
          ...prev,
          { userId, fullName, profilePic, message, time, fullDate },
        ]);
      }
    );
    return () => {
      socket.disconnect();
    };
  }, []);
  useEffect(() => {
    if (chatDivRef.current) {
      chatDivRef.current.scrollTop = chatDivRef.current.scrollHeight;
    }
  }, [allMessages]);

  const handleSend = () => {
    if (message === "") return;
    const socket = createSocketConnection();
    const fullName = userDetails.firstName + " " + userDetails.lastName;
    const dateObj = new Date();
    const hours =
      dateObj.getHours() >= 10 ? dateObj.getHours() : `0${dateObj.getHours()}`;
    const minutes =
      dateObj.getMinutes() >= 10
        ? dateObj.getMinutes()
        : `0${dateObj.getMinutes()}`;
    const time = hours + ":" + minutes;
    const date = dateObj.getDate();
    const month =
      dateObj.getMonth() + 1 >= 10
        ? dateObj.getMonth() + 1
        : `0${dateObj.getMonth() + 1}`;
    const year = dateObj.getFullYear();
    const fullDate = date + "/" + month + "/" + year;
    socket.emit("sendMessage", {
      fullName,
      profilePic: userDetails.profilePic,
      userId: userDetails._id,
      receiverId: id,
      message,
      time,
      fullDate,
    });
    setMessage("");
  };

  if (!userProfile) return;
  return (
    <div className="flex justify-center">
      <div className="mt-5 bg-black/50  w-150 h-150 relative">
        <div className="flex items-center p-2 bg-purple-300">
          <img
            className="rounded-full w-10 h-10 object-cover object-top"
            src={`${BASE_URL}/uploads/profilePicture/${userProfile.profilePic}`}
            alt=""
          />
          <h1 className="ml-2 font-bold">
            {userProfile.firstName} {userProfile.lastName}
          </h1>
        </div>
        <div className="p-3 overflow-auto h-125" ref={chatDivRef}>
          {allMessages.length !== 0 ? (
            <>
              {allMessages.map((msg, index) => {
                return (
                  <div
                    key={index}
                    className={`chat ${
                      msg.userId === userDetails._id ? "chat-end" : "chat-start"
                    }`}
                  >
                    <div className="chat-image avatar">
                      <div className="w-10 rounded-full">
                        <img
                          alt="Tailwind CSS chat bubble component"
                          src={`${BASE_URL}/uploads/profilePicture/${msg.profilePic}`}
                        />
                      </div>
                    </div>
                    <div className="chat-header text-white">
                      {msg.fullName}
                      <time className="text-xs opacity-50">
                        {msg.time}, {msg.fullDate}
                      </time>
                    </div>
                    <div className="chat-bubble">{msg.message}</div>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="flex justify-center flex-col items-center">
              <img src={chatLogo} className="w-30 mt-40" />
              <h2 className="text-center text-white uppercase">
                Begin the conversation
              </h2>
              <h2 className="text-center text-white">STAY CONNECTED</h2>
            </div>
          )}
        </div>
        <div className="absolute bottom-2 h-10 w-[100%] p-1">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            className="input w-128 bg-purple-300"
            placeholder="Type here.."
          />

          <button
            onClick={handleSend}
            className="btn w-19 ml-1 btn-sm mb-[2px] h-10 bg-purple-700 hover:bg-purple-800 border-0
          text-white"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Inbox;
