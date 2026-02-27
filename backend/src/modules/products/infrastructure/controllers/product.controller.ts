import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { GetProductsUseCase } from '../../application/use-cases/get-products.use-case';
import { GetProductByIdUseCase } from '../../application/use-cases/get-product-by-id.use-case';

@Controller('api/products')
export class ProductController {
  constructor(
    private readonly getProductsUseCase: GetProductsUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
  ) {}

  @Get()
  async findAll() {
    const result = await this.getProductsUseCase.execute();
    if (result.isFail()) {
      throw new NotFoundException(result.getError().message);
    }
    return result.getValue();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const result = await this.getProductByIdUseCase.execute(id);
    if (result.isFail()) {
      throw new NotFoundException(result.getError().message);
    }
    return result.getValue();
  }
}