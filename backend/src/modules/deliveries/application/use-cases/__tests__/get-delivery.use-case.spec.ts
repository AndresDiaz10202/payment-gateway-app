import { GetDeliveryUseCase } from '../get-delivery.use-case';

describe('GetDeliveryUseCase', () => {
  let useCase: GetDeliveryUseCase;
  let mockDeliveryRepository: any;

  beforeEach(() => {
    mockDeliveryRepository = {
      create: jest.fn(),
      findByTransactionId: jest.fn(),
    };
    useCase = new GetDeliveryUseCase(mockDeliveryRepository);
  });

  it('should return delivery by transaction id', async () => {
    const delivery = { id: '1', transactionId: 'tx1', address: 'Calle 123' };
    mockDeliveryRepository.findByTransactionId.mockResolvedValue(delivery);

    const result = await useCase.execute('tx1');

    expect(result.isOk()).toBe(true);
    expect(result.getValue()).toEqual(delivery);
  });

  it('should fail if delivery not found', async () => {
    mockDeliveryRepository.findByTransactionId.mockResolvedValue(null);

    const result = await useCase.execute('tx999');

    expect(result.isFail()).toBe(true);
    expect(result.getError().code).toBe('DELIVERY_NOT_FOUND');
  });

  it('should fail if repository throws', async () => {
    mockDeliveryRepository.findByTransactionId.mockRejectedValue(new Error('DB error'));

    const result = await useCase.execute('tx1');

    expect(result.isFail()).toBe(true);
    expect(result.getError().code).toBe('DELIVERY_FETCH_ERROR');
  });
});