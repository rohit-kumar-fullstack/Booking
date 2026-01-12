import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BookingItem {
  id: string;
  name: string;
  date: any;
  service: string;
}

const initialState: BookingItem[] = [];

export const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    addBooking: (state, action: PayloadAction<BookingItem>) => {
      const index = state.findIndex(
        item => item.id === action.payload.id
      );

      if (index !== -1) {
        state.splice(index, 1);
      } else {
        state.push(action.payload);
      }
    },

    updateBooking: (state, action: PayloadAction<{ id: string; data: Partial<BookingItem> }>) => {
      const index = state.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state[index] = {
          ...state[index],
          ...action.payload.data,
        };
      }
    },

    removeBooking: (state, action: PayloadAction<string>) => {
      return state.filter(item => item.id != action.payload);
    },
    clearBookings: () => [],
  },
});

export const {
  addBooking,
  updateBooking,
  removeBooking,
  clearBookings,
} = bookingSlice.actions;

export default bookingSlice.reducer;
