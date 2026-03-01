import productsReducer from '../store/slices/productsSlice';

describe('productsSlice', () => {
  const initialState = {
    items: [],
    selectedProduct: null,
    loading: false,
    error: null,
  };

  it('should return initial state', () => {
    expect(productsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should set loading on fetchProducts.pending', () => {
    const state = productsReducer(initialState, { type: 'products/fetchAll/pending' });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should set items on fetchProducts.fulfilled', () => {
    const products = [{ id: '1', name: 'Test', price: 100 }];
    const state = productsReducer(initialState, {
      type: 'products/fetchAll/fulfilled',
      payload: products,
    });
    expect(state.loading).toBe(false);
    expect(state.items).toEqual(products);
  });

  it('should set error on fetchProducts.rejected', () => {
    const state = productsReducer(initialState, {
      type: 'products/fetchAll/rejected',
      error: { message: 'Network error' },
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Network error');
  });
});