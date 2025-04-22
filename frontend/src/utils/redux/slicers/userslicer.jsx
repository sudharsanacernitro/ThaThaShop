import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: { userName: "Guest", isLoggedIn: false },
    reducers: {
      setUserName: (state, action) => { state.userName = action.payload; },
      toggleLogin: (state) => { state.isLoggedIn = !state.isLoggedIn; },
    },
  });
  
  export const { setUserName, toggleLogin } = userSlice.actions;
  export default userSlice.reducer;