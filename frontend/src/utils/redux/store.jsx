import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slicers/userslicer";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
