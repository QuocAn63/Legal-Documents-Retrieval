import { configureStore, combineReducers } from "@reduxjs/toolkit";
// import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import UserSlice from "./user";
import ConversationSlice from "./conversations";

const rootReducer = combineReducers({
  user: UserSlice,
  conversation: ConversationSlice,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  whitelist: ["user"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
