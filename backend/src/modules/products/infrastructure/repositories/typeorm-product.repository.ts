import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductOrmEntity } from '../entities/product.orm-entity';
import { IProductRepository } from '../../domain/ports/product-repository.port';
import { Product } from '../../domain/entities/product.entity';

@Injectable()
export class TypeOrmProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly repository: Repository<ProductOrmEntity>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<Product | null> {
    return this.repository.findOne({ where: { id } });
  }

  async updateStock(id: string, stock: number): Promise<void> {
    await this.repository.update(id, { stock });
  }
}