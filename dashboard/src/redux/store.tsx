import { configureStore, combineReducers } from "@reduxjs/toolkit";
// import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import AuthSlice from "./slices/auth";
import UserSlice from "./slices/user";
import ReportSlice from "./slices/report";
import DocumentSlice from "./slices/document";

const rootReducer = combineReducers({
  auth: AuthSlice,
  user: UserSlice,
  report: ReportSlice,
  document: DocumentSlice,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  whitelist: ["auth", "user", "report", "document"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
