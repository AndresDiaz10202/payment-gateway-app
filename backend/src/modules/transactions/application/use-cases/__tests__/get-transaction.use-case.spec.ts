import { GetTransactionUseCase } from '../get-transaction.use-case';

describe('GetTransactionUseCase', () => {
  let useCase: GetTransactionUseCase;
  let mockTransactionRepository: any;

  beforeEach(() => {
    mockTransactionRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
    };
    useCase = new GetTransactionUseCase(mockTransactionRepository);
  });

  it('should return a transaction by id', async () => {
    const transaction = { id: '1', reference: 'order_123', status: 'PENDING' };
    mockTransactionRepository.findById.mockResolvedValue(transaction);

    const result = await useCase.execute('1');

    expect(result.isOk()).toBe(true);
    expect(result.getValue()).toEqual(transaction);
  });

  it('should fail if transaction not found', async () => {
    mockTransactionRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute('999');

    expect(result.isFail()).toBe(true);
    expect(result.getError().code).toBe('TRANSACTION_NOT_FOUND');
  });

  it('should fail if repository throws', async () => {
    mockTransactionRepository.findById.mockRejectedValue(new Error('DB error'));

    const result = await useCase.execute('1');

    expect(result.isFail()).toBe(true);
    expect(result.getError().code).toBe('TRANSACTION_FETCH_ERROR');
  });
});