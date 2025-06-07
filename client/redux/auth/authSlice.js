import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user_id: null,
  email: null,
  user_role: null,
  sessionId: null,
  // _persist: { version: -1, rehydrated: false } // Removed, Redux Persist handles this
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user_id = action.payload.user_id;
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.user_role = action.payload.user_role;
    },
    setSessionId: (state, action) => {
      state.sessionId = action.payload;
    },
    logOut: () => initialState,
  },
  // Removed extraReducers block as Redux Persist handles rehydration
  // extraReducers: (builder) => {
  //   builder
  //     .addCase('persist/REHYDRATE', (state, action) => {
  //       if (action.payload) {
  //         state.token = action.payload.auth?.token || null;
  //         state.user_id = action.payload.auth?.user_id || null;
  //         state.email = action.payload.auth?.email || null;
  //       }
  //     });
  // }
});

export const { setCredentials, logOut, setSessionId } = authSlice.actions;
export default authSlice.reducer;