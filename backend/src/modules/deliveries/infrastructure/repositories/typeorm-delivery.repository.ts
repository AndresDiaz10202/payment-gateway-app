import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryOrmEntity } from '../entities/delivery.orm-entity';
import { IDeliveryRepository } from '../../domain/ports/delivery-repository.port';
import { Delivery } from '../../domain/entities/delivery.entity';

@Injectable()
export class TypeOrmDeliveryRepository implements IDeliveryRepository {
  constructor(
    @InjectRepository(DeliveryOrmEntity)
    private readonly repository: Repository<DeliveryOrmEntity>,
  ) {}

  async create(delivery: Partial<Delivery>): Promise<Delivery> {
    const entity = this.repository.create(delivery);
    return this.repository.save(entity);
  }

  async findByTransactionId(transactionId: string): Promise<Delivery | null> {
    return this.repository.findOne({ where: { transactionId } });
  }
}