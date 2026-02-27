import { Transaction } from '../entities/transaction.entity';
import { TransactionStatus } from '../enums/transaction-status.enum';

export interface ITransactionRepository {
  create(transaction: Partial<Transaction>): Promise<Transaction>;
  findById(id: string): Promise<Transaction | null>;
  updateStatus(id: string, status: TransactionStatus, externalTransactionId?: string): Promise<void>;
}