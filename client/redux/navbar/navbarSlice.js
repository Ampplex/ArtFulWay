import { createSlice, configureStore } from "@reduxjs/toolkit";

const navbarSlice = createSlice({
    name: "navbar",
    initialState: {
        user_loggedIn: false,
    },
    reducers: {
        setLoggedIn: (state, action) => {
            state.user_loggedIn = action.payload;
        }
    }
})

export const { setLoggedIn } = navbarSlice.actions;

export default navbarSlice.reducer;