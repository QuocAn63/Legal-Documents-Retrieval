import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    email: "",
    from: "",
    to: "",
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userUpdate: (state, action) => {
      console.log(action.payload);
      state.user = action.payload;
    },
    userClear: (state) => {
      state.user = {
        email: "",
        from: "",
        to: "",
      };
    },
  },
});
export const { userClear, userUpdate } = userSlice.actions;

export default userSlice.reducer;
