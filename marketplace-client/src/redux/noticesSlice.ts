import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INotice } from '@/types/notification/INotice';

interface NoticesState {
    count: number;
    notices: INotice[];
}

const initialNoticesState: NoticesState = {
    count: 0,
    notices: [],
};

const noticesSlice = createSlice({
    name: 'notices',
    initialState: initialNoticesState,
    reducers: {
        setNotices: (state, action: PayloadAction<INotice[]>) => {
            state.notices = action.payload;
            state.count = action.payload.length;
        },
        addNotice: (state, action: PayloadAction<INotice>) => {
            state.notices.unshift(action.payload);
            state.count += 1;
        },
        removeNotice: (state, action: PayloadAction<number>) => {
            state.notices = state.notices.filter((_, index) => index !== action.payload);
            state.count -= 1;
        },
        clearNotices: (state) => {
            state.notices = [];
            state.count = 0;
        },
        increment: (state) => {
            state.count += 1;
        },
        decrement: (state) => {
            if (state.count > 0) {
                state.count -= 1;
            }
        },
    },
});

export const { setNotices, addNotice, removeNotice, clearNotices } = noticesSlice.actions;
export default noticesSlice.reducer;