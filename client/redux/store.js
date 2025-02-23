import { configureStore } from "@reduxjs/toolkit";
import navbarReducer from "./navbar/navbarSlice";

export const store = configureStore({
    reducer: {
        navbar: navbarReducer,
    }
})