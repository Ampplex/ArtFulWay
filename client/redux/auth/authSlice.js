import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user_id: null,
  email: null,
  _persist: { version: -1, rehydrated: false } // Important for persistence
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user_id = action.payload.user_id;
      state.token = action.payload.token;
      state.email = action.payload.email;
    },
    logOut: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase('persist/REHYDRATE', (state, action) => {
      // Handle rehydration if needed
      console.log('Auth slice rehydrated');
    });
  }
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;