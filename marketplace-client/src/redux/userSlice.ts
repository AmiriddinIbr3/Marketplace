import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '@/types/user/IUser';

interface UserState {
    currentUser: IUser | undefined;
}

const initialUserState: UserState = {
    currentUser: undefined,
};

const userSlice = createSlice({
    name: 'user',
    initialState: initialUserState,
    reducers: {
        setUser(state, action: PayloadAction<IUser>) {
            state.currentUser = action.payload;
        },
        logoutUser(state) {
            state.currentUser = undefined;
        },
    },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;