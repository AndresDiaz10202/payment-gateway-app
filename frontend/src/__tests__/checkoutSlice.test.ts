import checkoutReducer, {
  setStep,
  setProductId,
  setCustomerData,
  setDeliveryData,
  setCardToken,
  setAcceptanceToken,
  setTransactionId,
  resetCheckout,
} from '../store/slices/checkoutSlice';

describe('checkoutSlice', () => {
  const initialState = {
    currentStep: 1 as const,
    productId: null,
    quantity: 1,
    customerData: { fullName: '', email: '', phone: '', legalIdType: 'CC', legalId: '' },
    deliveryData: { recipientName: '', address: '', city: '', department: '', phone: '' },
    cardToken: null,
    acceptanceToken: null,
    transactionId: null,
  };

  it('should return initial state', () => {
    expect(checkoutReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should set step', () => {
    const state = checkoutReducer(initialState, setStep(3));
    expect(state.currentStep).toBe(3);
  });

  it('should set productId', () => {
    const state = checkoutReducer(initialState, setProductId('prod-1'));
    expect(state.productId).toBe('prod-1');
  });

  it('should set customerData', () => {
    const data = { fullName: 'Juan', email: 'j@e.com', phone: '300', legalIdType: 'CC', legalId: '123' };
    const state = checkoutReducer(initialState, setCustomerData(data));
    expect(state.customerData).toEqual(data);
  });

  it('should set deliveryData', () => {
    const data = { recipientName: 'Juan', address: 'Calle 1', city: 'Bogotá', department: 'Cund', phone: '300' };
    const state = checkoutReducer(initialState, setDeliveryData(data));
    expect(state.deliveryData).toEqual(data);
  });

  it('should set cardToken', () => {
    const state = checkoutReducer(initialState, setCardToken('tok_123'));
    expect(state.cardToken).toBe('tok_123');
  });

  it('should set acceptanceToken', () => {
    const state = checkoutReducer(initialState, setAcceptanceToken('eyJ123'));
    expect(state.acceptanceToken).toBe('eyJ123');
  });

  it('should set transactionId', () => {
    const state = checkoutReducer(initialState, setTransactionId('tx-1'));
    expect(state.transactionId).toBe('tx-1');
  });

  it('should reset checkout', () => {
    const modified = { ...initialState, currentStep: 4 as const, productId: 'prod-1', cardToken: 'tok' };
    const state = checkoutReducer(modified, resetCheckout());
    expect(state).toEqual(initialState);
  });
});