import { createSlice } from "@reduxjs/toolkit";
import { IAuth } from "../interfaces/user";

const initialState: IAuth = {
  user: {
    token: null,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginRedux: (state, action) => {
      state.user.token = action.payload;
    },

    logOutRedux: (state) => {
      state.user.token = null;
    },
    loginGoogleRedux: (state, action) => {
      state.user.token = action.payload;
    },
  },
});
export const { loginRedux, logOutRedux, loginGoogleRedux } = userSlice.actions;

export default userSlice.reducer;
