import { createSlice } from "@reduxjs/toolkit";

import { IConversation } from "../interfaces/chat";

interface IListConversations {
  conversations: IConversation[];
}

const initialState: IListConversations = {
  conversations: [],
  //   error: null,
  //   loading: false,
  //   success: false,
};

const conversationSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    getConversationRedux: (state, action) => {
      state.conversations = action.payload;
    },

    addConversationRedux: (state, action) => {
      state.conversations = [action.payload, ...state.conversations];
    },
  },
});
export const { getConversationRedux, addConversationRedux } =
  conversationSlice.actions;

export default conversationSlice.reducer;
