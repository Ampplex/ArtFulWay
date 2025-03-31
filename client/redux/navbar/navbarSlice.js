import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user_loggedIn: false,
  user_role: null,
  _persist: { version: -1, rehydrated: false }
};

const navbarSlice = createSlice({
  name: "navbar",
  initialState,
  reducers: {
    setLoggedIn: (state, action) => {
      state.user_loggedIn = action.payload;
    },
    setUserRole: (state, action) => {
      state.user_role = action.payload;
    },
    resetNavbar: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase('persist/REHYDRATE', (state, action) => {
        if (action.payload) {
          state.user_loggedIn = action.payload.navbar?.user_loggedIn || false;
          state.user_role = action.payload.navbar?.user_role || null;
        }
      });
  }
});

export const { setLoggedIn, setUserRole, resetNavbar } = navbarSlice.actions;
export default navbarSlice.reducer;