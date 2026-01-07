import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    tender: '',
};

export const tenderSlice = createSlice({
    name: 'tender',
    initialState,
    reducers: {
        setTender: (state, { payload }) => {
            state.tender = payload;
        },
        removeTender: (state) => {
            state.tender = '';
        }
    },
});
export const { setTender , removeTender} = tenderSlice.actions;
export default tenderSlice.reducer;
