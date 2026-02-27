import { GetProductByIdUseCase } from '../get-product-by-id.use-case';

describe('GetProductByIdUseCase', () => {
  let useCase: GetProductByIdUseCase;
  let mockProductRepository: any;

  beforeEach(() => {
    mockProductRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      updateStock: jest.fn(),
    };
    useCase = new GetProductByIdUseCase(mockProductRepository);
  });

  it('should return a product by id', async () => {
    const product = { id: '1', name: 'Product 1', price: 100000, stock: 10 };
    mockProductRepository.findById.mockResolvedValue(product);

    const result = await useCase.execute('1');

    expect(result.isOk()).toBe(true);
    expect(result.getValue()).toEqual(product);
  });

  it('should return fail if product not found', async () => {
    mockProductRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute('999');

    expect(result.isFail()).toBe(true);
    expect(result.getError().code).toBe('PRODUCT_NOT_FOUND');
  });

  it('should return fail if repository throws', async () => {
    mockProductRepository.findById.mockRejectedValue(new Error('DB error'));

    const result = await useCase.execute('1');

    expect(result.isFail()).toBe(true);
    expect(result.getError().code).toBe('PRODUCT_FETCH_ERROR');
  });
});