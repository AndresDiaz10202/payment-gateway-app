import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import checkoutReducer from './slices/checkoutSlice';
import transactionReducer from './slices/transactionSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    checkout: checkoutReducer,
    transaction: transactionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;