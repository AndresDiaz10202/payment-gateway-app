import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOrmEntity } from './infrastructure/entities/product.orm-entity';
import { ProductController } from './infrastructure/controllers/product.controller';
import { TypeOrmProductRepository } from './infrastructure/repositories/typeorm-product.repository';
import { GetProductsUseCase } from './application/use-cases/get-products.use-case';
import { GetProductByIdUseCase } from './application/use-cases/get-product-by-id.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOrmEntity])],
  controllers: [ProductController],
  providers: [
    GetProductsUseCase,
    GetProductByIdUseCase,
    {
      provide: 'IProductRepository',
      useClass: TypeOrmProductRepository,
    },
  ],
  exports: ['IProductRepository'],
})
export class ProductModule {}