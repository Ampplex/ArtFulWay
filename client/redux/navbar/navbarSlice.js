import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // user_loggedIn: false, // Removed, derived from authSlice
  // user_role: null, // Removed, derived from authSlice
  // _persist: { version: -1, rehydrated: false } // Removed, Redux Persist handles this
};

const navbarSlice = createSlice({
  name: "navbar",
  initialState,
  reducers: {
    // setLoggedIn: (state, action) => { // Removed, derived from authSlice
    //   state.user_loggedIn = action.payload;
    // },
    // setUserRole: (state, action) => { // Removed, derived from authSlice
    //   state.user_role = action.payload;
    // },
    resetNavbar: () => initialState
  },
  // Removed extraReducers block as Redux Persist handles rehydration
  // extraReducers: (builder) => {
  //   builder
  //     .addCase('persist/REHYDRATE', (state, action) => {
  //       if (action.payload) {
  //         state.user_loggedIn = action.payload.navbar?.user_loggedIn || false;
  //         state.user_role = action.payload.navbar?.user_role || null;
  //       }
  //     });
  // }
});

export const { resetNavbar } = navbarSlice.actions;
export default navbarSlice.reducer;