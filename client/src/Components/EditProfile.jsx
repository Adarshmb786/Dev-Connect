import React, { useEffect, useState, useContext } from "react";
import { BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";
import { contextData } from "../Context/ContextDataa";
import { useNavigate } from "react-router-dom";
import LoadingEffect from "./LoadingEffect";
import { useDelayedNavigate } from "../Custom Hooks/useDelayedNavigate";

const EditProfile = () => {
  const navigate = useNavigate();
  const reRender = useContext(contextData);
  const delayedNavigate = useDelayedNavigate();
  const user = useSelector((store) => store.user);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState([]);
  const [skill, setSkill] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [error, setError] = useState("");
  const [loadEffect, setLoadEffect] = useState(false);
  useEffect(() => {
    if (user && user.userDetails) {
      const { userDetails } = user;
      setFirstName(userDetails.firstName || "");
      setLastName(userDetails.lastName || "");
      setGender(userDetails.gender || "");
      setAge(userDetails.age || "");
      setDescription(userDetails.description || "");
      setSkills(userDetails.skills || []);
    }
  }, [user]);

  const handleRemoveSkills = (skill) => {
    const filteredItems = skills.filter((item) => item !== skill);
    setSkills(filteredItems);
  };

  const handleAddSkills = () => {
    const alreadyIncluded = skills.includes(skill);
    if (alreadyIncluded) {
      return setSkill("");
    }
    var skillAfterTrim = skill.trim();
    if (skillAfterTrim.length <= 0) return;
    setSkills([...skills, skillAfterTrim]);
    setSkill("");
  };

  const handleUpdate = async () => {
    try {
      setError("");
      const formData = new FormData();
      if (profilePic) {
        formData.append("profilePic", profilePic);
      }
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("gender", gender);
      formData.append("description", description);
      formData.append("age", age);

      skills.forEach((skill) => {
        formData.append("skills", skill);
      });
      const response = await fetch(BASE_URL + "/profile/updateprofile", {
        method: "PATCH",
        body: formData,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return setError(data.message);
      }
      reRender();
      delayedNavigate(setLoadEffect, "/profile");
      setLoadEffect(true);
    } catch (err) {
      console.log(err);
    }
  };
  if (!user) return;
  if (loadEffect) {
    return <LoadingEffect />;
  }
  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center bg-blue-100/10 p-10 backdrop-blur-md bg-white/10 shadow-xl border border-white/20">
        <h1 className="text-3xl text-white">Edit Profile</h1>
        <div className="mt-2">
          <label>Profile Picture</label>
          <input
            className="file-input w-[100%] hover:bg-purple-100"
            onChange={(e) => setProfilePic(e.target.files[0])}
            accept="image/*"
            type="file"
          />
        </div>
        <div className="w-[100%] mt-2">
          <label htmlFor="">First Name</label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="input w-[100%] hover:bg-purple-100"
            type="text"
          />
        </div>
        <div className="w-[100%] mt-2">
          <label htmlFor="">Last Name</label>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="input w-[100%] hover:bg-purple-100"
            type="text"
          />
        </div>
        <div className="w-[100%] mt-2">
          <label htmlFor="">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="select w-[100%] hover:bg-purple-100"
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="w-[100%] mt-2">
          <label htmlFor="">Age</label>
          <input
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="input w-[100%] hover:bg-purple-100"
            type="number"
            placeholder="Enter you age."
          />
        </div>
        <div className="w-[100%] mt-2">
          <label htmlFor="">About me</label>
          <textarea
            className="textarea w-[100%] hover:bg-purple-100"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell us about you."
          ></textarea>
        </div>
        <div className=" w-[100%] mt-3">
          <label htmlFor="">Skills</label>
          <input
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="input input-sm w-55 ml-4 hover:bg-purple-100"
            type="text"
            placeholder="Enter skills"
          />
          <button
            onClick={handleAddSkills}
            className="btn ml-2 btn-sm w-22 text-white bg-blue-700 hover:bg-blue-600 border-0"
          >
            Add
          </button>
        </div>
        <div className="mt-2">
          <ul className="flex w-[310px] ml-14 flex-wrap">
            {skills.map((item, index) => (
              <li key={index} className="flex ml-1 text-sm">
                <p>{item}</p>
                <span
                  onClick={() => handleRemoveSkills(item)}
                  className="text-white cursor-pointer ml-1"
                  title="Remove"
                >
                  &times;
                </span>
              </li>
            ))}
          </ul>
        </div>
        {error && <p className="text-red-600 w-[364px]">{error}</p>}
        <button
          onClick={handleUpdate}
          className="btn btn-sm mt-2 border-0 text-white bg-blue-800 hover:bg-blue-700"
        >
          Update
        </button>
        <button
          onClick={() => navigate("/profile")}
          className="btn btn-sm mt-2 border-0 text-white bg-blue-700 hover:bg-blue-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
