import React from "react";
import UserCard from "./UserCard";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((store) => store.user.userDetails);
  return <UserCard user={user} profilePage />;
};

export default Profile;
