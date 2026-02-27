import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionOrmEntity } from '../entities/transaction.orm-entity';
import { ITransactionRepository } from '../../domain/ports/transaction-repository.port';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionStatus } from '../../domain/enums/transaction-status.enum';

@Injectable()
export class TypeOrmTransactionRepository implements ITransactionRepository {
  constructor(
    @InjectRepository(TransactionOrmEntity)
    private readonly repository: Repository<TransactionOrmEntity>,
  ) {}

  async create(transaction: Partial<Transaction>): Promise<Transaction> {
    const entity = this.repository.create(transaction);
    return this.repository.save(entity);
  }

  async findById(id: string): Promise<Transaction | null> {
    return this.repository.findOne({ where: { id } });
  }

  async updateStatus(
    id: string,
    status: TransactionStatus,
    externalTransactionId?: string,
  ): Promise<void> {
    const updateData: Partial<TransactionOrmEntity> = { status };
    if (externalTransactionId) {
      updateData.externalTransactionId = externalTransactionId;
    }
    await this.repository.update(id, updateData);
  }
}