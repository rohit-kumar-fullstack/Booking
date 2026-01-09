import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TenderItem {
    TenderNumber: string;
    [key: string]: any;
}

// ✅ DEFAULT = EMPTY ARRAY
const initialState: TenderItem[] = [];

export const selectPurchaseTenderSlice = createSlice({
    name: 'selectPurchaseTender',
    initialState,
    reducers: {
        togglePurchaseTender: (
            state,
            action: PayloadAction<TenderItem>
        ) => {
            const index = state.findIndex(
                item => item.tenderId === action.payload.tenderId
            );

            if (index !== -1) {
                state.splice(index, 1);
            } else {
                state.push(action.payload);
            }
        },

        clearPurchaseTender: () => [],
    },
});

export const {
    togglePurchaseTender,
    clearPurchaseTender,
} = selectPurchaseTenderSlice.actions;

export default selectPurchaseTenderSlice.reducer;
