import { createSlice } from "@reduxjs/toolkit";
import { IAuth } from "../interfaces/user";

const initialState: IAuth = {
  user: {
    id: null,
    isAdmin: false,
    username: null,
    email: null,
    accessToken: null,
  },
  error: null,
  loading: false,
  success: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.user = action.payload;
    },
    loginFailure: (state, action) => {
      (state.error = action.payload), (state.loading = false);
    },
    logOutStart: (state) => {
      state.loading = true;
      state.success = true;
    },
    logOutSuccess: (state) => {
      state.user = null;
      state.loading = false;
      state.success = true;
    },
    logOutFailure: (state, action) => {
      state.loading = true;
      state.error = action.payload;
      state.success = false;
    },

    signUpStart: (state) => {
      state.loading = true;
    },
    signUpSuccess: (state) => {
      state.loading = false;
      state.success = true;
    },
    signUpFailure: (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },
  },
});
export const {
  loginStart,
  loginFailure,
  loginSuccess,
  logOutFailure,
  logOutStart,
  logOutSuccess,
  signUpStart,
  signUpFailure,
  signUpSuccess,
} = userSlice.actions;

export default userSlice.reducer;
