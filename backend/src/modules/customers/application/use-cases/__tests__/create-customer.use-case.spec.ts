import { CreateCustomerUseCase } from '../create-customer.use-case';

describe('CreateCustomerUseCase', () => {
  let useCase: CreateCustomerUseCase;
  let mockCustomerRepository: any;

  beforeEach(() => {
    mockCustomerRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
    };
    useCase = new CreateCustomerUseCase(mockCustomerRepository);
  });

  it('should create a new customer', async () => {
    const input = {
      fullName: 'Juan Pérez',
      email: 'juan@email.com',
      phone: '3001234567',
      legalIdType: 'CC',
      legalId: '1234567890',
    };
    mockCustomerRepository.findByEmail.mockResolvedValue(null);
    mockCustomerRepository.create.mockResolvedValue({ id: '1', ...input });

    const result = await useCase.execute(input);

    expect(result.isOk()).toBe(true);
    expect(result.getValue().fullName).toBe('Juan Pérez');
    expect(mockCustomerRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should return existing customer if email exists', async () => {
    const existing = { id: '1', fullName: 'Juan', email: 'juan@email.com', phone: '300' };
    mockCustomerRepository.findByEmail.mockResolvedValue(existing);

    const result = await useCase.execute({ fullName: 'Juan', email: 'juan@email.com', phone: '300' });

    expect(result.isOk()).toBe(true);
    expect(result.getValue()).toEqual(existing);
    expect(mockCustomerRepository.create).not.toHaveBeenCalled();
  });

  it('should fail if required fields are missing', async () => {
    const result = await useCase.execute({ fullName: '', email: '', phone: '' });

    expect(result.isFail()).toBe(true);
    expect(result.getError().code).toBe('INVALID_CUSTOMER_DATA');
  });

  it('should fail if repository throws', async () => {
    mockCustomerRepository.findByEmail.mockRejectedValue(new Error('DB error'));

    const result = await useCase.execute({
      fullName: 'Juan',
      email: 'juan@email.com',
      phone: '300',
    });

    expect(result.isFail()).toBe(true);
    expect(result.getError().code).toBe('CUSTOMER_CREATE_ERROR');
  });
});