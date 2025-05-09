import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: { userRole: "Guest", isLoggedIn: false },
    reducers: {
      setUserRole: (state, action) => { state.userRole = action.payload; },
      toggleLogin: (state) => { state.isLoggedIn = !state.isLoggedIn; },
    },
  });
  
  export const { setUserRole, toggleLogin } = userSlice.actions;
  export default userSlice.reducer;