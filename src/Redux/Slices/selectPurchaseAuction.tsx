import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuctionItem {
    auctionNumber: string;
    [key: string]: any;
}

// ✅ DEFAULT = EMPTY ARRAY
const initialState: AuctionItem[] = [];

export const selectPurchaseAuctionSlice = createSlice({
    name: 'selectPurchaseAuction',
    initialState,
    reducers: {
        togglePurchaseAuction: (
            state,
            action: PayloadAction<AuctionItem>
        ) => {
            const index = state.findIndex(
                item => item.auctionNumber === action.payload.auctionNumber
            );

            if (index !== -1) {
                state.splice(index, 1);
            } else {
                state.push(action.payload);
            }
        },

        clearPurchaseAuction: () => [],
    },
});

export const {
    togglePurchaseAuction,
    clearPurchaseAuction,
} = selectPurchaseAuctionSlice.actions;

export default selectPurchaseAuctionSlice.reducer;
