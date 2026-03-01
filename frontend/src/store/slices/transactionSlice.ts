import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Transaction } from '../../types';

const API_URL = 'http://localhost:3000';

interface TransactionState {
  current: Transaction | null;
  status: 'idle' | 'pending' | 'completed' | 'failed';
  error: string | null;
}

const initialState: TransactionState = {
  current: null,
  status: 'idle',
  error: null,
};

export const createTransaction = createAsyncThunk(
  'transaction/create',
  async (data: any) => {
    const response = await axios.post(`${API_URL}/api/transactions`, data);
    return response.data;
  },
);

export const pollTransactionStatus = createAsyncThunk(
  'transaction/poll',
  async (transactionId: string) => {
    const response = await axios.get(`${API_URL}/api/transactions/${transactionId}/poll`);
    return response.data;
  },
);

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    resetTransaction(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTransaction.pending, (state) => {
        state.status = 'pending';
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.current = action.payload;
        state.status = 'pending';
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error al crear la transacción';
      })
      .addCase(pollTransactionStatus.fulfilled, (state, action) => {
        state.current = action.payload;
        if (action.payload.status !== 'PENDING') {
          state.status = action.payload.status === 'APPROVED' ? 'completed' : 'failed';
        }
      });
  },
});

export const { resetTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;