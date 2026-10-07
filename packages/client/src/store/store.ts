import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import favouriteUsersReducer from "./favouriteUsersSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        favouriteUsers: favouriteUsersReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;