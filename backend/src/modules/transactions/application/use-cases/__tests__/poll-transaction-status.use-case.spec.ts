import { PollTransactionStatusUseCase } from '../poll-transaction-status.use-case';
import { TransactionStatus } from '../../../domain/enums/transaction-status.enum';

describe('PollTransactionStatusUseCase', () => {
  let useCase: PollTransactionStatusUseCase;
  let mockTransactionRepo: any;
  let mockPaymentGateway: any;
  let mockProductRepo: any;

  beforeEach(() => {
    mockTransactionRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
    };
    mockPaymentGateway = {
      createTransaction: jest.fn(),
      getTransaction: jest.fn(),
    };
    mockProductRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      updateStock: jest.fn(),
    };

    useCase = new PollTransactionStatusUseCase(
      mockTransactionRepo,
      mockPaymentGateway,
      mockProductRepo,
    );
  });

  it('should return transaction not found', async () => {
    mockTransactionRepo.findById.mockResolvedValue(null);

    const result = await useCase.execute('tx-999');

    expect(result.isFail()).toBe(true);
    expect(result.getError().code).toBe('TRANSACTION_NOT_FOUND');
  });

  it('should return transaction if already has final status', async () => {
    const transaction = { id: 'tx-1', status: TransactionStatus.APPROVED };
    mockTransactionRepo.findById.mockResolvedValue(transaction);

    const result = await useCase.execute('tx-1');

    expect(result.isOk()).toBe(true);
    expect(result.getValue().status).toBe(TransactionStatus.APPROVED);
    expect(mockPaymentGateway.getTransaction).not.toHaveBeenCalled();
  });

  it('should return pending transaction if no external id', async () => {
    const transaction = {
      id: 'tx-1',
      status: TransactionStatus.PENDING,
      externalTransactionId: null,
    };
    mockTransactionRepo.findById.mockResolvedValue(transaction);

    const result = await useCase.execute('tx-1');

    expect(result.isOk()).toBe(true);
    expect(result.getValue().status).toBe(TransactionStatus.PENDING);
  });

  it('should poll and update status to APPROVED', async () => {
    const transaction = {
      id: 'tx-1',
      status: TransactionStatus.PENDING,
      externalTransactionId: 'ext-123',
      productId: 'prod-1',
      quantity: 1,
    };
    const product = { id: 'prod-1', stock: 10 };

    mockTransactionRepo.findById.mockResolvedValue(transaction);
    mockPaymentGateway.getTransaction.mockResolvedValue({ id: 'ext-123', status: 'APPROVED', reference: 'ref' });
    mockProductRepo.findById.mockResolvedValue(product);

    const result = await useCase.execute('tx-1');

    expect(result.isOk()).toBe(true);
    expect(result.getValue().status).toBe(TransactionStatus.APPROVED);
    expect(mockTransactionRepo.updateStatus).toHaveBeenCalledWith('tx-1', TransactionStatus.APPROVED);
    expect(mockProductRepo.updateStock).toHaveBeenCalledWith('prod-1', 9);
  });

  it('should poll and update status to DECLINED', async () => {
    const transaction = {
      id: 'tx-1',
      status: TransactionStatus.PENDING,
      externalTransactionId: 'ext-123',
      productId: 'prod-1',
      quantity: 1,
    };

    mockTransactionRepo.findById.mockResolvedValue(transaction);
    mockPaymentGateway.getTransaction.mockResolvedValue({ id: 'ext-123', status: 'DECLINED', reference: 'ref' });

    const result = await useCase.execute('tx-1');

    expect(result.isOk()).toBe(true);
    expect(result.getValue().status).toBe(TransactionStatus.DECLINED);
    expect(mockProductRepo.updateStock).not.toHaveBeenCalled();
  });

  it('should handle gateway error', async () => {
    const transaction = {
      id: 'tx-1',
      status: TransactionStatus.PENDING,
      externalTransactionId: 'ext-123',
    };

    mockTransactionRepo.findById.mockResolvedValue(transaction);
    mockPaymentGateway.getTransaction.mockRejectedValue(new Error('Gateway down'));

    const result = await useCase.execute('tx-1');

    expect(result.isFail()).toBe(true);
    expect(result.getError().code).toBe('POLL_ERROR');
  });
});