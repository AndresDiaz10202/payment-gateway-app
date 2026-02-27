import { GetCustomerUseCase } from '../get-customer.use-case';

describe('GetCustomerUseCase', () => {
  let useCase: GetCustomerUseCase;
  let mockCustomerRepository: any;

  beforeEach(() => {
    mockCustomerRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
    };
    useCase = new GetCustomerUseCase(mockCustomerRepository);
  });

  it('should return a customer by id', async () => {
    const customer = { id: '1', fullName: 'Juan', email: 'juan@email.com' };
    mockCustomerRepository.findById.mockResolvedValue(customer);

    const result = await useCase.execute('1');

    expect(result.isOk()).toBe(true);
    expect(result.getValue()).toEqual(customer);
  });

  it('should fail if customer not found', async () => {
    mockCustomerRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute('999');

    expect(result.isFail()).toBe(true);
    expect(result.getError().code).toBe('CUSTOMER_NOT_FOUND');
  });

  it('should fail if repository throws', async () => {
    mockCustomerRepository.findById.mockRejectedValue(new Error('DB error'));

    const result = await useCase.execute('1');

    expect(result.isFail()).toBe(true);
    expect(result.getError().code).toBe('CUSTOMER_FETCH_ERROR');
  });
});