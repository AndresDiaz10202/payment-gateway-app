import { CreateTransactionUseCase } from '../create-transaction.use-case';
import { TransactionStatus } from '../../../domain/enums/transaction-status.enum';

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;
  let mockTransactionRepo: any;
  let mockProductRepo: any;
  let mockCustomerRepo: any;
  let mockDeliveryRepo: any;
  let mockPaymentGateway: any;

  const validInput = {
    productId: 'prod-1',
    quantity: 1,
    customerData: {
      fullName: 'Juan Pérez',
      email: 'juan@email.com',
      phone: '3001234567',
      legalIdType: 'CC',
      legalId: '1234567890',
    },
    deliveryData: {
      recipientName: 'Juan Pérez',
      address: 'Calle 123',
      city: 'Bogotá',
      department: 'Cundinamarca',
      phone: '3001234567',
    },
    cardToken: 'tok_stagtest_123',
    acceptanceToken: 'eyJ123',
  };

  beforeEach(() => {
    mockTransactionRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
    };
    mockProductRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      updateStock: jest.fn(),
    };
    mockCustomerRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
    };
    mockDeliveryRepo = {
      create: jest.fn(),
      findByTransactionId: jest.fn(),
    };
    mockPaymentGateway = {
      createTransaction: jest.fn(),
      getTransaction: jest.fn(),
    };

    useCase = new CreateTransactionUseCase(
      mockTransactionRepo,
      mockProductRepo,
      mockCustomerRepo,
      mockDeliveryRepo,
      mockPaymentGateway,
    );
  });

  it('should create a transaction successfully', async () => {
    const product = { id: 'prod-1', name: 'iPhone', price: 499900000, stock: 10 };
    const customer = { id: 'cust-1', email: 'juan@email.com' };
    const transaction = { id: 'tx-1', reference: 'order_123', status: TransactionStatus.PENDING };

    mockProductRepo.findById.mockResolvedValue(product);
    mockCustomerRepo.findByEmail.mockResolvedValue(null);
    mockCustomerRepo.create.mockResolvedValue(customer);
    mockTransactionRepo.create.mockResolvedValue(transaction);
    mockDeliveryRepo.create.mockResolvedValue({});
    mockPaymentGateway.createTransaction.mockResolvedValue({
      id: 'ext-123',
      status: 'PENDING',
      reference: 'order_123',
    });

    const result = await useCase.execute(validInput);

    expect(result.isOk()).toBe(true);
    expect(result.getValue().id).toBe('tx-1');
    expect(mockTransactionRepo.create).toHaveBeenCalledTimes(1);
    expect(mockPaymentGateway.createTransaction).toHaveBeenCalledTimes(1);
  });

  it('should fail if productId is missing', async () => {
    const result = await useCase.execute({ ...validInput, productId: '' });

    expect(result.isFail()).toBe(true);
    expect(result.getError().code).toBe('INVALID_INPUT');
  });

  it('should fail if quantity is 0', async () => {
    const result = await useCase.execute({ ...validInput, quantity: 0 });

    expect(result.isFail()).toBe(true);
    expect(result.getError().code).toBe('INVALID_INPUT');
  });

  it('should fail if cardToken is missing', async () => {
    const result = await useCase.execute({ ...validInput, cardToken: '' });

    expect(result.isFail()).toBe(true);
    expect(result.getError().code).toBe('INVALID_INPUT');
  });

  it('should fail if product not found', async () => {
    mockProductRepo.findById.mockResolvedValue(null);

    const result = await useCase.execute(validInput);

    expect(result.isFail()).toBe(true);
    expect(result.getError().code).toBe('PRODUCT_NOT_FOUND');
  });

  it('should fail if stock is insufficient', async () => {
    mockProductRepo.findById.mockResolvedValue({ id: 'prod-1', price: 100000, stock: 0 });

    const result = await useCase.execute(validInput);

    expect(result.isFail()).toBe(true);
    expect(result.getError().code).toBe('INSUFFICIENT_STOCK');
  });

  it('should use existing customer if email exists', async () => {
    const product = { id: 'prod-1', price: 100000, stock: 10 };
    const existingCustomer = { id: 'cust-1', email: 'juan@email.com' };
    const transaction = { id: 'tx-1', reference: 'order_123' };

    mockProductRepo.findById.mockResolvedValue(product);
    mockCustomerRepo.findByEmail.mockResolvedValue(existingCustomer);
    mockTransactionRepo.create.mockResolvedValue(transaction);
    mockDeliveryRepo.create.mockResolvedValue({});
    mockPaymentGateway.createTransaction.mockResolvedValue({ id: 'ext-1', status: 'PENDING', reference: 'ref' });

    const result = await useCase.execute(validInput);

    expect(result.isOk()).toBe(true);
    expect(mockCustomerRepo.create).not.toHaveBeenCalled();
  });

  it('should set status to ERROR if payment gateway fails', async () => {
    const product = { id: 'prod-1', price: 100000, stock: 10 };
    const customer = { id: 'cust-1', email: 'juan@email.com' };
    const transaction = { id: 'tx-1', reference: 'order_123' };

    mockProductRepo.findById.mockResolvedValue(product);
    mockCustomerRepo.findByEmail.mockResolvedValue(customer);
    mockTransactionRepo.create.mockResolvedValue(transaction);
    mockDeliveryRepo.create.mockResolvedValue({});
    mockPaymentGateway.createTransaction.mockRejectedValue(new Error('Gateway error'));

    const result = await useCase.execute(validInput);

    expect(result.isFail()).toBe(true);
    expect(result.getError().code).toBe('PAYMENT_ERROR');
    expect(mockTransactionRepo.updateStatus).toHaveBeenCalledWith('tx-1', TransactionStatus.ERROR);
  });
});