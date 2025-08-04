import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: "",
  role: "",
  isLogged: true,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.role = action.payload.role;
      state.isLogged = action.payload.isLogged;
      state.userId = action.payload.userId;
    },
    removeUser: (state) => {
      state.role = "";
      state.isLogged = false;
      state.userId = null;
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
