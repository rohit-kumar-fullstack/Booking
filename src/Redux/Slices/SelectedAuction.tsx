import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    auction: '',
};

export const auctionSlice = createSlice({
    name: 'auction',
    initialState,
    reducers: {
        setAuction: (state, { payload }) => {
            state.auction = payload;
        },
        removeAuction: (state) => {
            state.auction = '';
        }
    },
});
export const { setAuction , removeAuction} = auctionSlice.actions;
export default auctionSlice.reducer;
