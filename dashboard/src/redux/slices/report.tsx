import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  report: {
    description: "",
    from: "",
    to: "",
    reasonID: "",
    status: 0,
  },
};

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    reportUpdate: (state, action) => {
      state.report = action.payload;
    },
    reportClear: (state) => {
      state.report = {
        description: "",
        from: "",
        to: "",
        reasonID: "",
        status: 0,
      };
    },
  },
});
export const { reportClear, reportUpdate } = reportSlice.actions;

export default reportSlice.reducer;
