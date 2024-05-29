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
    update: (state, action) => {
      console.log(action.payload);
      state.user = action.payload;
    },
    clear: (state) => {
      state.user = {
        email: "",
        from: "",
        to: "",
      };
    },
  },
});
export const { update, clear } = userSlice.actions;

export default userSlice.reducer;
