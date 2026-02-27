import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../../shared/result';
import { DomainError } from '../../../../shared/errors/domain-error';
import { Product } from '../../domain/entities/product.entity';
import type { IProductRepository } from '../../domain/ports/product-repository.port';

@Injectable()
export class GetProductsUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(): Promise<Result<Product[], DomainError>> {
    try {
      const products = await this.productRepository.findAll();
      return Result.ok(products);
    } catch (error) {
      return Result.fail(
        DomainError.create('PRODUCTS_FETCH_ERROR', 'Error al obtener productos'),
      );
    }
  }
}