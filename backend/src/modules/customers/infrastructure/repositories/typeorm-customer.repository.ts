import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerOrmEntity } from '../entities/customer.orm-entity';
import { ICustomerRepository } from '../../domain/ports/customer-repository.port';
import { Customer } from '../../domain/entities/customer.entity';

@Injectable()
export class TypeOrmCustomerRepository implements ICustomerRepository {
  constructor(
    @InjectRepository(CustomerOrmEntity)
    private readonly repository: Repository<CustomerOrmEntity>,
  ) {}

  async create(customer: Partial<Customer>): Promise<Customer> {
    const entity = this.repository.create(customer);
    return this.repository.save(entity);
  }

  async findById(id: string): Promise<Customer | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<Customer | null> {
    return this.repository.findOne({ where: { email } });
  }
}