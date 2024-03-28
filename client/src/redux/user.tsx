import { createSlice } from "@reduxjs/toolkit";
import { IAuth } from "../interfaces/user";

const initialState: IAuth = {
  user: {
    id: null,
    isAdmin: false,
    username: null,
    email: null,
    token: null,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginRedux: (state, action) => {
      state.user = action.payload;
    },

    logOutRedux: (state) => {
      state.user = null;
    },
  },
});
export const { loginRedux, logOutRedux } = userSlice.actions;

export default userSlice.reducer;
