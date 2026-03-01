import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CustomerData, DeliveryData } from '../../types';

interface CheckoutState {
  currentStep: 1 | 2 | 3 | 4 | 5;
  productId: string | null;
  quantity: number;
  customerData: CustomerData;
  deliveryData: DeliveryData;
  cardToken: string | null;
  acceptanceToken: string | null;
  transactionId: string | null;
}

const initialState: CheckoutState = {
  currentStep: 1,
  productId: null,
  quantity: 1,
  customerData: {
    fullName: '',
    email: '',
    phone: '',
    legalIdType: 'CC',
    legalId: '',
  },
  deliveryData: {
    recipientName: '',
    address: '',
    city: '',
    department: '',
    phone: '',
  },
  cardToken: null,
  acceptanceToken: null,
  transactionId: null,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setStep(state, action: PayloadAction<1 | 2 | 3 | 4 | 5>) {
      state.currentStep = action.payload;
    },
    setProductId(state, action: PayloadAction<string>) {
      state.productId = action.payload;
    },
    setCustomerData(state, action: PayloadAction<CustomerData>) {
      state.customerData = action.payload;
    },
    setDeliveryData(state, action: PayloadAction<DeliveryData>) {
      state.deliveryData = action.payload;
    },
    setCardToken(state, action: PayloadAction<string>) {
      state.cardToken = action.payload;
    },
    setAcceptanceToken(state, action: PayloadAction<string>) {
      state.acceptanceToken = action.payload;
    },
    setTransactionId(state, action: PayloadAction<string>) {
      state.transactionId = action.payload;
    },
    resetCheckout(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setStep,
  setProductId,
  setCustomerData,
  setDeliveryData,
  setCardToken,
  setAcceptanceToken,
  setTransactionId,
  resetCheckout,
} = checkoutSlice.actions;
export default checkoutSlice.reducer;