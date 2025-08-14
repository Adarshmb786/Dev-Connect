import React, { useEffect, useState } from "react";
import UserCard from "./UserCard";
import { BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";

const Feed = () => {
  const user = useSelector((store) => store.user);
  const [users, setUsers] = useState([]);
  const fetchUsers = async () => {
    try {
      if (!user) return;
      const response = await fetch(BASE_URL + "/user/feed", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return console.log(data);
      }
      setUsers(data.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [user]);

  if (users.length === 0) {
    return (
      <div className="flex justify-center mt-40">
        <h1 className="font-mono text-3xl">
          No new users. <i className="fas fa-face-sad-tear"></i>
        </h1>
      </div>
    );
  }
  return <UserCard user={users[0]} fetchUsers={fetchUsers} />;
};

export default Feed;
