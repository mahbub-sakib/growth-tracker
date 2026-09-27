import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface User {
    id: string;
    email: string;
    role: string;
    department: string;
    experienceLevel: string;
    teamName: string | null;
    bio: string | null;
    birthdate: string;
    createdAt: string;
    addresses: unknown[];
}

interface UserState {
    user: User | null;
}

const initialState: UserState = {
    user: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },

        clearUser: (state) => {
            state.user = null;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;