import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user_loggedIn: false,
  user_role: null,
  _persist: { version: -1, rehydrated: false } // Add this for persistence
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
    builder.addCase('persist/REHYDRATE', (state, action) => {
      // Handle rehydration if needed
      console.log('Navbar slice rehydrated');
    });
  }
});

export const { setLoggedIn, setUserRole, resetNavbar } = navbarSlice.actions;
export default navbarSlice.reducer;