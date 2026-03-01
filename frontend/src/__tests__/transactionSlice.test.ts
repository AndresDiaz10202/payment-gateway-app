import transactionReducer, { resetTransaction } from '../store/slices/transactionSlice';

describe('transactionSlice', () => {
  const initialState = {
    current: null,
    status: 'idle' as const,
    error: null,
  };

  it('should return initial state', () => {
    expect(transactionReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should set pending on createTransaction.pending', () => {
    const state = transactionReducer(initialState, { type: 'transaction/create/pending' });
    expect(state.status).toBe('pending');
    expect(state.error).toBeNull();
  });

  it('should set current on createTransaction.fulfilled', () => {
    const tx = { id: 'tx-1', status: 'PENDING', reference: 'ref-1' };
    const state = transactionReducer(initialState, {
      type: 'transaction/create/fulfilled',
      payload: tx,
    });
    expect(state.current).toEqual(tx);
    expect(state.status).toBe('pending');
  });

  it('should set error on createTransaction.rejected', () => {
    const state = transactionReducer(initialState, {
      type: 'transaction/create/rejected',
      error: { message: 'Failed' },
    });
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Failed');
  });

  it('should update on poll fulfilled with APPROVED', () => {
    const state = transactionReducer(
      { ...initialState, status: 'pending' },
      {
        type: 'transaction/poll/fulfilled',
        payload: { id: 'tx-1', status: 'APPROVED' },
      },
    );
    expect(state.current?.status).toBe('APPROVED');
    expect(state.status).toBe('completed');
  });

  it('should update on poll fulfilled with DECLINED', () => {
    const state = transactionReducer(
      { ...initialState, status: 'pending' },
      {
        type: 'transaction/poll/fulfilled',
        payload: { id: 'tx-1', status: 'DECLINED' },
      },
    );
    expect(state.status).toBe('failed');
  });

  it('should keep pending on poll with PENDING', () => {
    const state = transactionReducer(
      { ...initialState, status: 'pending' },
      {
        type: 'transaction/poll/fulfilled',
        payload: { id: 'tx-1', status: 'PENDING' },
      },
    );
    expect(state.status).toBe('pending');
  });

  it('should reset transaction', () => {
    const modified = { current: { id: 'tx-1' } as any, status: 'completed' as const, error: null };
    const state = transactionReducer(modified, resetTransaction());
    expect(state).toEqual(initialState);
  });
});