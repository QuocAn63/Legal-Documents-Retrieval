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
    renameTitleRedux: (state, action) => {
      const indexRename = state.conversations.findIndex(
        (item) => item.conversationID === action.payload.conversationID
      );
      if (indexRename !== -1) {
        return {
          ...state,
          conversations: state.conversations.map((conversation, index) => {
            if (index === indexRename) {
              return {
                ...conversation,
                title: action.payload.title,
              };
            }
            return conversation;
          }),
        };
      }
      return state;
    },
  },
});
export const { getConversationRedux, addConversationRedux, renameTitleRedux } =
  conversationSlice.actions;

export default conversationSlice.reducer;
