import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auth: {
    token: "",
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRedux: (state, action) => {
      state.auth.token = action.payload;
    },

    logOutRedux: (state) => {
      state.auth.token = "";
    },
  },
});
export const { loginRedux, logOutRedux } = authSlice.actions;

export default authSlice.reducer;
