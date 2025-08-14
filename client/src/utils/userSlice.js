import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userDetails: null,
    token: localStorage.getItem("token") || null,
  },
  reducers: {
    ADD_USER: (state, action) => {
      return {
        userDetails: action.payload,
        token: localStorage.getItem("token"),
      };
    },
    REMOVE_USER: (state) => {
      return null;
    },
  },
});

export const { ADD_USER, REMOVE_USER } = userSlice.actions;
export default userSlice.reducer;
