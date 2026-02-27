import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../../shared/result';
import { DomainError } from '../../../../shared/errors/domain-error';
import { Product } from '../../domain/entities/product.entity';
import type { IProductRepository } from '../../domain/ports/product-repository.port';

@Injectable()
export class GetProductByIdUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: string): Promise<Result<Product, DomainError>> {
    try {
      const product = await this.productRepository.findById(id);
      if (!product) {
        return Result.fail(
          DomainError.create('PRODUCT_NOT_FOUND', `Producto con id ${id} no encontrado`),
        );
      }
      return Result.ok(product);
    } catch (error) {
      return Result.fail(
        DomainError.create('PRODUCT_FETCH_ERROR', 'Error al obtener el producto'),
      );
    }
  }
}