import React, { use, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserCard from "./UserCard";
import { BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";

const ViewProfile = () => {
  const { id } = useParams();
  const { token } = useSelector((store) => store.user);
  const [user, setUser] = useState(null);

  const fetchUserProfile = async (req, res) => {
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
      setUser(data.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchUserProfile();
  }, []);
  return <UserCard user={user} connectionViewProfile />;
};

export default ViewProfile;
