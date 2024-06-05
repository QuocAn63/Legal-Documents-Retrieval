import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  document: {
    content: "",
    from: "",
    to: "",
    label: "",
  },
};

const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    documentUpdate: (state, action) => {
      state.document = action.payload;
    },
    documentClear: (state) => {
      state.document = {
        content: "",
        from: "",
        to: "",
        label: "",
      };
    },
  },
});
export const { documentClear, documentUpdate } = documentSlice.actions;

export default documentSlice.reducer;
