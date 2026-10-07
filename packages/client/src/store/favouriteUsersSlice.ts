import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface FavouriteUsersState {
    favouriteUserIds: string[];
}

const initialState: FavouriteUsersState = {
    favouriteUserIds: [],
};

const favouriteUsersSlice = createSlice({
    name: "favouriteUsers",

    initialState,

    reducers: {
        setFavouriteUsers: (
            state,
            action: PayloadAction<string[]>
        ) => {
            state.favouriteUserIds = action.payload;
        },

        addFavouriteUser: (
            state,
            action: PayloadAction<string>
        ) => {
            if (!state.favouriteUserIds.includes(action.payload)) {
                state.favouriteUserIds.push(action.payload);
            }
        },

        removeFavouriteUser: (
            state,
            action: PayloadAction<string>
        ) => {
            state.favouriteUserIds =
                state.favouriteUserIds.filter(
                    (id) => id !== action.payload
                );
        },
    },
});

export const {
    setFavouriteUsers,
    addFavouriteUser,
    removeFavouriteUser,
} = favouriteUsersSlice.actions;

export default favouriteUsersSlice.reducer;