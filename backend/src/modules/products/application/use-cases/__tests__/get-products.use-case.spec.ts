import { GetProductsUseCase } from '../get-products.use-case';

describe('GetProductsUseCase', () => {
  let useCase: GetProductsUseCase;
  let mockProductRepository: any;

  beforeEach(() => {
    mockProductRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      updateStock: jest.fn(),
    };
    useCase = new GetProductsUseCase(mockProductRepository);
  });

  it('should return all products', async () => {
    const products = [
      { id: '1', name: 'Product 1', price: 100000, stock: 10 },
      { id: '2', name: 'Product 2', price: 200000, stock: 5 },
    ];
    mockProductRepository.findAll.mockResolvedValue(products);

    const result = await useCase.execute();

    expect(result.isOk()).toBe(true);
    expect(result.getValue()).toEqual(products);
    expect(mockProductRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return fail if repository throws', async () => {
    mockProductRepository.findAll.mockRejectedValue(new Error('DB error'));

    const result = await useCase.execute();

    expect(result.isFail()).toBe(true);
    expect(result.getError().code).toBe('PRODUCTS_FETCH_ERROR');
  });
});