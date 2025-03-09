import {createSlice, configureStore} from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: null,
        user_id: null,
        email: null
    },
    reducers: {
        setCredentials: (state, action) => {
            state.user_id = action.payload.user_id;
            state.token = action.payload.token;
            state.email = action.payload.email;
        },
        logOut: (state, action) => {
            state.user_id = null;
            state.email = null;
            state.token = null;
        }
    }
})

export const {setCredentials, logOut} = authSlice.actions;

export default authSlice.reducer;