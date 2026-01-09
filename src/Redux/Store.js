import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {tokenSlice} from './Slices/Token';
import {auctionSlice} from './Slices/SelectedAuction';
import selectPurchaseAuctionReducer from './Slices/selectPurchaseAuction'
import selectPurchaseTenderReducer from './Slices/SelectedPurchaseTender';
import { tenderSlice } from './Slices/SelectedTender';

const rootReducer = combineReducers({
  token: tokenSlice.reducer,
  auction: auctionSlice.reducer,
  selectPurchaseAuction: selectPurchaseAuctionReducer,
  selectPurchaseTender: selectPurchaseTenderReducer,
  tender: tenderSlice.reducer,
});
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['token'],
};
const persistReducers = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistReducers,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export const persistor = persistStore(store);
