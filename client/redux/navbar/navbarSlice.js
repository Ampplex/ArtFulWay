import { createSlice, configureStore } from "@reduxjs/toolkit";

const navbarSlice = createSlice({
    name: "navbar",
    initialState: {
        user_loggedIn: false,
        user_role: null
    },
    reducers: {
        setLoggedIn: (state, action) => {
            state.user_loggedIn = action.payload;
        },
        setUserRole: (state, action) => {
            state.user_role = action.payload;
        }
    }
})

export const { setLoggedIn, setUserRole } = navbarSlice.actions;

export default navbarSlice.reducer;